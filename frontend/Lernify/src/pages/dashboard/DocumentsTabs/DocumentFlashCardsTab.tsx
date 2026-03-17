import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrainCircuit, Loader2, Trash2 } from 'lucide-react';
import Dialog from '../../../components/dialog';
import FlashcardViewer, { type FlashcardSet } from './FlashCardViewer';
import { flashcardService } from '../../../services/flashcardService';
import { aiService } from '../../../services/aiService';
import { sileo } from 'sileo';

export default function DocumentFlashcardsTab() {
  const { id: documentId } = useParams();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSets = async () => {
    if (!documentId) return;
    setIsLoading(true);
    try {
      const response = await flashcardService.getFlashcardsByDocument(documentId);
      if (response.success) {
        setSets(response.data || []);
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to fetch flashcards'});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, [documentId]);

  const handleGenerate = async () => {
    if (!documentId) return;
    setIsGenerating(true);
    setGenerateError('');
    try {
      const response = await aiService.generateFlashcards(documentId, generateCount);
      if (response.success) {
        setSets(prev => [response.data, ...prev]);
        setIsGenerateDialogOpen(false);
        sileo.success({title: response.message})
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to generate flashcards'});
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteSet = async () => {
    if (!setToDelete) return;
    setIsDeleting(true);
    try {
      const response = await flashcardService.deleteFlashcard(setToDelete);
      if (response.success) {
        setSets(prev => prev.filter(set => set._id !== setToDelete));
        setIsDeleteDialogOpen(false);
        setSetToDelete(null);
        sileo.success({title: response.message});
      } 
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to delete flashcard set'});
    } finally {
      setIsDeleting(false);
    }
  };

  if (activeSet) {
    return <FlashcardViewer flashcardSet={activeSet} onBack={() => setActiveSet(null)} />;
  }

  return (
    <div className="bg-card/50 rounded-4xl border border-border/50 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold mb-1">Your Flashcard Sets</h2>
          <p className="text-sm text-muted-foreground">{sets.length} set{sets.length !== 1 ? 's' : ''} available</p>
        </div>
        <button 
          onClick={() => setIsGenerateDialogOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Generate New Set
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
          <BrainCircuit className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Flashcards Yet</h3>
          <p className="text-muted-foreground mb-4">Generate your first set of flashcards from this document.</p>
          <button 
            onClick={() => setIsGenerateDialogOpen(true)}
            className="text-primary font-medium hover:underline"
          >
            Generate Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            <div 
              key={set._id}
              onClick={() => setActiveSet(set)}
              className="border border-border/80 shadow-sm rounded-3xl p-6 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group bg-card"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <BrainCircuit className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSetToDelete(set._id);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-lg mb-1">Flashcard Set</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">
                CREATED {new Date(set.createdAt).toLocaleDateString()}
              </p>
              <div className="inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold">
                {set.cards?.length || 0} cards
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        isOpen={isGenerateDialogOpen}
        onClose={() => !isGenerating && setIsGenerateDialogOpen(false)}
        title="Generate Flashcards"
        subtitle="AI will analyze your document and create a study set."
        maxWidth="md"
      >
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Cards</label>
            <input 
              type="number" 
              min="1" 
              max="50"
              value={generateCount}
              onChange={(e) => setGenerateCount(parseInt(e.target.value) || 10)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground mt-2">Choose how many flashcards you want to generate (max 50).</p>
          </div>

          {generateError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {generateError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <button 
              onClick={() => setIsGenerateDialogOpen(false)}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
        title="Delete Flashcard Set"
        maxWidth="sm"
      >
        <div className="mt-4">
          <p className="text-foreground/80">Are you sure you want to delete this flashcard set? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSet}
              disabled={isDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}