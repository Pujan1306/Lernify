import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Tabs from '../../components/tabs';
import DocumentContentTab from './DocumentsTabs/DocumentContentTab';
import DocumentChatTab from './DocumentsTabs/DocumentChatTab';
import DocumentAIActionsTab from './DocumentsTabs/DocumentAIActionTab';
import DocumentFlashcardsTab from './DocumentsTabs/DocumentFlashCardsTab';
import DocumentQuizzesTab from './DocumentsTabs/DocumentQuizzesTab';
import { documentService } from '../../services/documentService';

const TABS = [
  { id: 'content', label: 'Content' },
  { id: 'chat', label: 'Chat' },
  { id: 'ai-actions', label: 'AI Actions' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quizzes', label: 'Quizzes' },
];

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const getDocumentById = async () => {
      try {
        const response = await documentService.getDocumentById(id as string);
        if (response.success) {
          setFileUrl(response.data.filePath);
          setFileName(response.data.fileName);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    getDocumentById();
  }, [id]);

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return <DocumentContentTab fileUrl={fileUrl} />;
      case 'chat':
        return <DocumentChatTab />;
      case 'ai-actions':
        return <DocumentAIActionsTab />;
      case 'flashcards':
        return <DocumentFlashcardsTab />;
      case 'quizzes':
        return <DocumentQuizzesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/documents')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Documents
      </button>

      <h1 className="text-3xl font-bold tracking-tight">{fileName || 'Document...'}</h1>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
}
