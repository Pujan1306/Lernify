import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrainCircuit, Loader2, Trash2, Trophy, Play, BarChart2 } from 'lucide-react';
import Dialog from '../../../components/dialog';
import QuizTaker from '../Quiz/quizTaker';
import QuizResults from '../Quiz/quizResult';
import { quizService } from '../../../services/quizService';
import { sileo } from 'sileo';
import { aiService } from '../../../services/aiService';

interface Quiz {
  _id: string;
  title: string;
  score: number;
  totalQuestions: number;
  completedAt: string | null;
  createdAt: string;
}

export default function DocumentQuizzesTab() {
  const { id: documentId } = useParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'take' | 'results'>('list');

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(5);
  const [generateTitle, setGenerateTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuizzes = async () => {
    if (!documentId) return;
    setIsLoading(true);
    try {
      const response = await quizService.getQuizzesByDocument(documentId);
      if (response.success) {
        setQuizzes(response.data || []);
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to fetch quizzes'});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [documentId]);

  const handleGenerate = async () => {
    if (!documentId) return;
    setIsGenerating(true);
    setGenerateError('');
    try {
      const response = await aiService.generateQuiz(documentId, generateCount, generateTitle);
      if (response.success) {
        setQuizzes(prev => [response.data, ...prev]);
        setIsGenerateDialogOpen(false);
      } else {
        setGenerateError(response.message || 'Failed to generate quiz');
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to generate quiz'});
      setGenerateError('Network error while generating quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    try {
      const response = await quizService.deleteQuiz(quizToDelete);
      if (response.success) {
        setQuizzes(prev => prev.filter(q => q._id !== quizToDelete));
        setIsDeleteDialogOpen(false);
        setQuizToDelete(null);
        sileo.success({title: response.message});
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'Failed to delete quiz'});
    } finally {
      setIsDeleting(false);
    }
  };

  if (viewMode === 'take' && activeQuizId) {
    return <QuizTaker quizId={activeQuizId} onBack={() => { setViewMode('list'); fetchQuizzes(); }} onComplete={() => { setViewMode('results'); fetchQuizzes(); }} />;
  }

  if (viewMode === 'results' && activeQuizId) {
    return <QuizResults quizId={activeQuizId} onBack={() => { setViewMode('list'); fetchQuizzes(); }} />;
  }

  return (
    <div className="bg-card/50 rounded-4xl border border-border/50 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold mb-1">Your Quizzes</h2>
          <p className="text-sm text-muted-foreground">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available</p>
        </div>
        <button 
          onClick={() => setIsGenerateDialogOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Generate Quiz
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
          <BrainCircuit className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Quizzes Yet</h3>
          <p className="text-muted-foreground mb-4">Generate your first quiz to test your knowledge.</p>
          <button 
            onClick={() => setIsGenerateDialogOpen(true)}
            className="text-primary font-medium hover:underline"
          >
            Generate Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="border border-border/80 shadow-sm rounded-3xl p-6 relative group bg-card hover:shadow-md hover:border-primary/50 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Score: {quiz.completedAt ? Math.round(quiz.score) : 0}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuizToDelete(quiz._id);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{quiz.title}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">
                CREATED {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
              
              <div className="inline-block border border-border px-3 py-1.5 rounded-lg text-xs font-medium mb-6 w-fit">
                {quiz.totalQuestions} Questions
              </div>
              
              <div className="mt-auto pt-4">
                {quiz.completedAt ? (
                  <button 
                    onClick={() => { setActiveQuizId(quiz._id); setViewMode('results'); }}
                    className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <BarChart2 className="w-4 h-4" />
                    View Results
                  </button>
                ) : (
                  <button 
                    onClick={() => { setActiveQuizId(quiz._id); setViewMode('take'); }}
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        isOpen={isGenerateDialogOpen}
        onClose={() => !isGenerating && setIsGenerateDialogOpen(false)}
        title="Generate Quiz"
        subtitle="AI will analyze your document and create a multiple-choice quiz."
        maxWidth="md"
      >
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Quiz Title</label>
            <input 
              type="text" 
              value={generateTitle}
              onChange={(e) => setGenerateTitle(e.target.value)}
              placeholder="Enter a title for your quiz"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground mt-2">Give your quiz a descriptive title.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Number of Questions</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={generateCount}
              onChange={(e) => setGenerateCount(parseInt(e.target.value) || 5)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground mt-2">Choose how many questions you want to generate (max 20).</p>
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
        title="Delete Quiz"
        maxWidth="sm"
      >
        <div className="mt-4">
          <p className="text-foreground/80">Are you sure you want to delete this quiz? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteQuiz}
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