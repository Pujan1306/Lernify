import { FileText, BookOpen, BrainCircuit, Clock, CheckCircle, Circle, Play, BarChart2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { progressService } from '../../services/progressService';
import { Link } from 'react-router-dom';
import QuizTaker from './Quiz/quizTaker';
import QuizResults from './Quiz/quizResult';

export default function Dashboard() {

  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);

  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'take' | 'results'>('dashboard');
  const fetchProgressData = async () => {
    try {
      const response = await progressService.getDashboardProgress();
      if (response.success) {
        setTotalDocuments(response.data.overview.totalDocuments);
        setTotalFlashcards(response.data.overview.totalFlashCards);
        setTotalQuizzes(response.data.overview.totalQuizzes);
        setRecentDocuments(response.data.recentActivities.recentDocuments?.slice(0, 5) || []);
        setRecentQuizzes(response.data.recentActivities.recentQuizzes?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [])

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setViewMode('take');
  };

  const handleViewResults = (quizId: string) => {
    setActiveQuizId(quizId);
    setViewMode('results');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setActiveQuizId(null);
    fetchProgressData();
  };

  if (viewMode === 'take' && activeQuizId) {
    return <QuizTaker quizId={activeQuizId} onBack={handleBackToDashboard} onComplete={() => { setViewMode('results'); }} />;
  }

  if (viewMode === 'results' && activeQuizId) {
    return <QuizResults quizId={activeQuizId} onBack={handleBackToDashboard} />;
  }
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Track your learning progress and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Documents</p>
            <p className="text-4xl font-bold">{totalDocuments}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Flashcards</p>
            <p className="text-4xl font-bold">{totalFlashcards}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#D946EF] to-[#EC4899] flex items-center justify-center shadow-lg shadow-[#EC4899]/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Quizzes</p>
            <p className="text-4xl font-bold">{totalQuizzes}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-foreground" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        
        <div className="space-y-8">
          {/* Recent Documents */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Documents</h3>
            <div className="space-y-3">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <Link 
                    key={doc._id} 
                    to={`/documents/${doc._id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <FileText className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{doc.title}</h4>
                        <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {doc.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground capitalize">{doc.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(doc.lastAccess).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent documents</p>
              )}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Quizzes</h3>
            <div className="space-y-3">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <div 
                    key={quiz._id} 
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all group cursor-pointer"
                    onClick={() => {
                      if (quiz.completedAt) {
                        handleViewResults(quiz._id);
                      } else {
                        handleStartQuiz(quiz._id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                        <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{quiz.title}</h4>
                        <p className="text-sm text-muted-foreground">Document: {quiz.documentId?.title || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {quiz.completedAt ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {quiz.completedAt ? `Score: ${quiz.score}` : 'Not completed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {quiz.completedAt ? (
                          <BarChart2 className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Play className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      {quiz.completedAt && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(quiz.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent quizzes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
