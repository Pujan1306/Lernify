import { dbConnect } from "../../lib/dbConnect.js";
import FlashCard from "../../model/flashCard.js";

export const getFlashCards = async (req, res) => {
  try {
    await dbConnect();

    const documentId = req.params.documentId || req.query.documentId;

    const flashCards = await FlashCard.find({ userId: req.user._id, documentId }).populate({
        path: "documentId",
        select: "title fileName"
      }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: flashCards,
      count: flashCards.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllFlashCardSets = async (req, res) => {
    try {
        await dbConnect();
        const flashCardSets = await FlashCard.find({ userId: req.user._id }).populate("documentId", "title").sort({ createdAt: -1 });
        if (!flashCardSets) {
            return res.status(404).json({ success: false, message: "No flash card sets found" });
        }
        res.status(200).json({ success: true, message: "Flash card sets fetched successfully", data: flashCardSets, count: flashCardSets.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const reviewFlashCard = async (req, res) => {
    try {
        await dbConnect();
        const flashCard = await FlashCard.findOne({"cards._id": req.params.cardId, userId: req.user._id});
        if (!flashCard) {
            return res.status(404).json({ success: false, message: "No flash card found" });
        }
        const cardIndex = flashCard.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if (cardIndex === -1) {
            return res.status(404).json({ success: false, message: "No flash card found" });
        }
        const card = flashCard.cards[cardIndex];
        card.lastReviewed = new Date();
        card.reviewCount = (card.reviewCount || 0) + 1;
        await flashCard.save();
        res.status(200).json({success: true, message: "Flash card reviewed successfully", data: flashCard});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleStarFlashCard = async (req, res) => {
    try {
        await dbConnect();
        const flashCard = await FlashCard.findOne({"cards._id": req.params.cardId, userId: req.user._id});
        if (!flashCard) {
            return res.status(404).json({ success: false, message: "No flash card found" });
        }
        const cardIndex = flashCard.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if (cardIndex === -1) {
            return res.status(404).json({ success: false, message: "No flash card found" });
        }
        const card = flashCard.cards[cardIndex];
        card.isStarred = !card.isStarred;
        await flashCard.save();
        res.status(200).json({success: true, message: "Flash card starred successfully", data: flashCard});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteFlashCardSet = async (req, res) => {
    try {
        await dbConnect();
        const flashCard = await FlashCard.findOne({ _id: req.params.id, userId: req.user._id });
        if (!flashCard) {
            return res.status(404).json({ success: false, message: "No flash card found" });
        }
        await flashCard.deleteOne();
        res.status(200).json({ success: true, message: "Flash card set deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};