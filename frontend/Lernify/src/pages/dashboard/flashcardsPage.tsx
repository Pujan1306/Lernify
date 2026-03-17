import { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Trash2, FileText, Search, SortAsc, SortDesc } from 'lucide-react';
import FlashcardViewer, { type FlashcardSet } from './DocumentsTabs/FlashCardViewer';
import Dialog from '../../components/dialog';
import { flashcardService } from '../../services/flashcardService';
import { sileo } from 'sileo';

interface GlobalFlashcardSet extends FlashcardSet {
  documentId?: {
    _id: string;
    title: string;
  };
}

export default function Flashcards() {
  const [sets, setSets] = useState<GlobalFlashcardSet[]>([]);
  const [filteredSets, setFilteredSets] = useState<GlobalFlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSet, setActiveSet] = useState<GlobalFlashcardSet | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'cards' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchFlashcardSets = async () => {
    setIsLoading(true);
    try {
      const response = await flashcardService.getFlashcards();
      if (response.success) {
        setSets(response.data || []);
      }
    } catch (error) {
     sileo.error({title: error instanceof Error ? error.message : 'Failed to fetch flashcard sets'});
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort sets
  useEffect(() => {
    let filtered = [...sets];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(set => 
        set.documentId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        'flashcard set'.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'cards':
          comparison = (a.cards?.length || 0) - (b.cards?.length || 0);
          break;
        case 'title':
          comparison = (a.documentId?.title || '').localeCompare(b.documentId?.title || '');
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredSets(filtered);
  }, [sets, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const handleDeleteSet = async () => {
    if (!setToDelete) return;
    setIsDeleting(true);
    try {
      const response = await flashcardService.deleteFlashcard(setToDelete);
      if (response.success) {
        setSets(prev => prev.filter(set => set._id !== setToDelete));
        setIsDeleteDialogOpen(false);
        setSetToDelete(null);
        sileo.success({title: response.message})
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to delete flashcard set'});
    } finally {
      setIsDeleting(false);
    }
  };

  if (activeSet) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <FlashcardViewer flashcardSet={activeSet} onBack={() => setActiveSet(null)} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Flashcards</h1>
          <p className="text-muted-foreground">Review flashcards from all your documents</p>
        </div>
        
        {/* Filters and Sort */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search flashcards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'cards' | 'title')}
              className="px-3 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="date">Date</option>
              <option value="cards">Card Count</option>
              <option value="title">Title</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-border rounded-xl bg-card hover:bg-muted transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredSets.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl bg-card">
          <BrainCircuit className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No Matching Flashcards</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchTerm ? 'No flashcards match your search criteria.' : 'You haven\'t generated any flashcards yet. Go to a document to generate your first set!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map(set => (
            <div 
              key={set._id}
              onClick={() => setActiveSet(set)}
              className="border border-border/80 shadow-sm rounded-3xl p-6 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group bg-card flex flex-col h-full"
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
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {set.documentId?.title || 'Flashcard Set'}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
                <FileText className="w-3.5 h-3.5" />
                <span>Source Document</span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="inline-block bg-muted px-3 py-1.5 rounded-lg text-xs font-medium">
                  {set.cards?.length || 0} Cards
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {new Date(set.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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
