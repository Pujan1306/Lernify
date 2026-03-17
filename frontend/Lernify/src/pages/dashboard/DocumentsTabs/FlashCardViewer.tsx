import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { flashcardService } from '../../../services/flashcardService';
import { sileo } from 'sileo';

export interface Card {
  _id: string;
  question: string;
  answer: string;
  difficulty: string;
  isStarred: boolean;
}

export interface FlashcardSet {
  _id: string;
  createdAt: string;
  cards: Card[];
}

interface FlashcardViewerProps {
  flashcardSet: FlashcardSet;
  onBack: () => void;
}

export default function FlashcardViewer({ flashcardSet, onBack }: FlashcardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [localCards, setLocalCards] = useState<Card[]>(flashcardSet.cards);
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());

  // Reset state when set changes
  useEffect(() => {
    setLocalCards(flashcardSet.cards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setReviewedCards(new Set());
  }, [flashcardSet]);

  if (!localCards || localCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No cards in this set.</p>
        <button onClick={onBack} className="mt-4 text-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const currentCard = localCards[currentCardIndex];

  const handleNextCard = () => {
    if (currentCardIndex < localCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    const newCards = [...localCards];
    newCards[currentCardIndex].isStarred = !newCards[currentCardIndex].isStarred;
    setLocalCards(newCards);

    try {
      
      const response = await flashcardService.toggleStar(currentCard._id);
      if (response.success) {
        sileo.success({title: response.message});
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to toggle star'});
      const reverted = [...localCards];
      reverted[currentCardIndex].isStarred = !reverted[currentCardIndex].isStarred;
      setLocalCards(reverted);
    }
  };

  const handleReviewCard = async () => {
    try {
      const response = await flashcardService.reviewFlashcard(currentCard._id);
      if (response.success) {
        setReviewedCards(prev => new Set(prev).add(currentCard._id));
        sileo.success({title: response.message});
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to review card'});
    }
  };

  const handleCardFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    
    if (newFlippedState && !reviewedCards.has(currentCard._id)) {
      handleReviewCard();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sets
      </button>
      
      <div className="flex flex-col items-center">
        {/* 3D Container */}
        <div className="relative w-full max-w-3xl h-[400px] perspective-[1000px] mx-auto group">
          <div 
            className="w-full h-full transition-all duration-500 cursor-pointer relative"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
            onClick={handleCardFlip}
          >
            {/* Front of Card (Question) */}
            <div 
              className="absolute inset-0 w-full h-full bg-card rounded-4xl border border-border/50 p-10 flex flex-col shadow-sm hover:shadow-md transition-shadow custom-scrollbar"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex justify-between items-start w-full mb-8">
                <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty || 'Medium'}
                </span>
                <button 
                  className={`transition-colors p-2.5 rounded-xl ${currentCard.isStarred ? 'bg-yellow-50 text-yellow-500' : 'bg-muted/50 text-muted-foreground hover:text-yellow-500 hover:bg-muted'}`}
                  onClick={handleToggleStar}
                >
                  <Star className="w-5 h-5" fill={currentCard.isStarred ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="flex-1 flex items-center justify-center text-center px-12">
                <div className="h-full max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                  <h3 className="text-2xl font-medium leading-relaxed wrap-break-word">
                    {currentCard.question}
                  </h3>
                </div>
              </div>
              
              <div className="w-full flex justify-center mt-12 text-muted-foreground group-hover:text-foreground transition-colors">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <RotateCw className="w-4 h-4" />
                  Click to reveal answer
                </div>
              </div>
            </div>

            {/* Back of Card (Answer) - Green Background */}
            <div 
              className="absolute inset-0 w-full h-full bg-primary text-white rounded-4xl p-10 flex flex-col shadow-lg custom-scrollbar"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="flex justify-between items-start w-full mb-8">
                <span className="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase bg-white/20 text-white">
                  Answer
                </span>
                <button 
                  className={`transition-colors p-2.5 rounded-xl ${currentCard.isStarred ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/10 text-white/70 hover:text-yellow-300 hover:bg-white/20'}`}
                  onClick={handleToggleStar}
                >
                  <Star className="w-5 h-5" fill={currentCard.isStarred ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="flex-1 flex items-center justify-center text-center px-12 overflow-hidden">
                <div className="h-full max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                  <h3 className="text-2xl font-medium leading-relaxed wrap-break-word">
                    {currentCard.answer}
                  </h3>
                </div>
              </div>
              
              <div className="w-full flex justify-center mt-12 text-white/70 group-hover:text-white transition-colors">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <RotateCw className="w-4 h-4" />
                  Click to see question
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button 
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="px-5 py-2.5 rounded-xl bg-card border border-border text-sm font-medium min-w-20 text-center shadow-sm">
            {currentCardIndex + 1} / {localCards.length}
          </span>
          <button 
            onClick={handleNextCard}
            disabled={currentCardIndex === localCards.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}