import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import Tesseract from "tesseract.js";
import path from "path";
import os from "os";
import { createRequire } from "module";
import { pathToFileURL } from "url";
import sharp from "sharp";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "canvas"; 

const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));

pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(
  path.join(pdfjsDistPath, "legacy/build/pdf.worker.mjs")
).href;

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const parser = new PDFParse(new Uint8Array(dataBuffer));
  const data = await parser.getText();

  return {
    text: data.text?.trim() ?? "",
    info: data.info,
  };
};

const getPageCount = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const pdfDoc = await pdfjsLib
    .getDocument({
      data: new Uint8Array(dataBuffer),
      disableFontFace: true,
      verbosity: 0,
    })
    .promise;
  return pdfDoc.numPages;
};

const extractTextViaOCR = async (filePath, numPages) => {
  const dataBuffer = await fs.readFile(filePath);
  const pdfDoc = await pdfjsLib.getDocument({
    data: new Uint8Array(dataBuffer),
    disableFontFace: true,
    verbosity: 0,
  }).promise;

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-ocr-"));
  const pageTexts = [];

  for (let i = 1; i <= numPages; i++) {
    try {
      console.log(`[OCR] Processing page ${i}/${numPages}...`);

      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 3.5 }); 
      
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext("2d");

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imgPath = path.join(tmpDir, `page-${i}.png`);
      
      await sharp(canvas.toBuffer("image/png"))
        .grayscale()
        .normalize()
        .sharpen()
        .threshold(180)
        .toFile(imgPath);

      const { data } = await Tesseract.recognize(imgPath, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            process.stdout.write(`\r[OCR] Page ${i}: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      console.log(`\n[OCR] Page ${i}: ${data?.text?.trim().length ?? 0} chars extracted`);

      const pageText = data?.text?.trim();
      if (pageText) pageTexts.push(pageText);

      await fs.unlink(imgPath).catch(() => {});
    } catch (err) {
      console.warn(`[OCR] Page ${i} error: ${err.message}`);
    }
  }

  await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});

  if (pageTexts.length === 0) {
    throw new Error("OCR produced no text from any page");
  }

  return pageTexts.join("\n\n--- Page Break ---\n\n");
};

const isTextMeaningful = (text, numPages) => {
  if (!text) return false;
  return text.length / numPages > 100;
};

export const pdfParser = async (filePath) => {
  try {
    const numPages = await getPageCount(filePath);
    console.log(`[pdfParser] Page count: ${numPages}`);

    const { text, info } = await extractTextFromPDF(filePath);
    console.log(`[pdfParser] Text extraction: ${text.length} chars`);

    if (isTextMeaningful(text, numPages)) {
      return { text, numPages, info, method: "text" };
    }

    console.log("[pdfParser] Falling back to high-strength OCR...");
    const ocrText = await extractTextViaOCR(filePath, numPages);

    return { text: ocrText, numPages, info, method: "ocr" };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};