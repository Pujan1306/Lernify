import { useEffect, useState } from 'react';
import { Plus, FileText, BookOpen, BrainCircuit, Clock, Trash2, Upload } from 'lucide-react';
import Dialog from '../../components/dialog';
import { documentService } from '../../services/documentService';
import { sileo } from 'sileo';
import { Link } from 'react-router-dom';

interface Document {
  _id: string;
  title: string;
  size: string;
  totalFlashcards: number;
  totalQuizzes: number;
  uplaodDate: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const refreshDocuments = async () => {
    const response = await documentService.getDocuments();
    if (response.success) {
      setDocuments(response.data);
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;

    try {
      const response = await documentService.deleteDocumentById(docToDelete);
      if (response.success) {
        sileo.success({ title: response.message });
        await refreshDocuments();
        setDocToDelete(null);
      }
    } catch (error) {
      sileo.error({ title: error instanceof Error ? error.message : "An unknown error occurred", });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) return;

    setIsUploading(true);
    try {
      const response = await documentService.createDocument(uploadFile, uploadTitle);
      if (response.success) {
        sileo.success({ title: response.message });
        await refreshDocuments();
        setUploadTitle('');
        setUploadFile(null);
        setIsUploadOpen(false);
      }
    }
    catch (error) {
      sileo.error({ title: error instanceof Error ? error.message : "An unknown error occurred", });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Documents</h1>
          <p className="text-muted-foreground text-sm">Manage and organize your learning materials</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Link to={`/documents/${doc._id}`} key={doc._id}>
            <div className="border border-border/80 shadow-sm rounded-3xl p-6 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group bg-card">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <FileText className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDocToDelete(doc._id);
                  }}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <h3 className="font-bold text-lg mb-1 truncate" title={doc.title}>{doc.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
                <FileText className="w-3.5 h-3.5" />
                <span>Source Document</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>{doc.totalFlashcards} Flashcards</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-primary px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <BrainCircuit className="w-4 h-4" />
                  <span>{doc.totalQuizzes} Quizzes</span>
                </div>
              </div>

              <div className="pt-5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>Upload Date:</span>
                <span className="uppercase tracking-wider">
                  {new Date(doc.uplaodDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload New Document"
        subtitle="Add a PDF document to your library"
      >
        <div className="space-y-6 mt-6">
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Document Title</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g., React Interview Prep"
              className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PDF File</label>
            <div className="relative border-2 border-dashed border-border rounded-4xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-medium mb-1">
                {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-muted-foreground">PDF up to 10MB</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadFile || !uploadTitle.trim() || isUploading}
              className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        isOpen={docToDelete !== null}
        onClose={() => setDocToDelete(null)}
        title="Confirm Deletion"
        icon={
          <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center">
            <Trash2 className="w-7 h-7" />
          </div>
        }
      >
        <div className="space-y-8 mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete the document: <span className="font-bold text-foreground">{documents.find(d => d._id === docToDelete)?.title}</span>? This action cannot be undone.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDocToDelete(null)}
              className="flex-1 px-4 py-3.5 border border-border rounded-2xl font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-3.5 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
