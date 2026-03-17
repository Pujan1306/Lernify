import { useState } from 'react';
import { Sparkles, BookOpen, Loader2 } from 'lucide-react';
import Dialog from '../../../components/dialog';
import { sileo } from 'sileo';
import { aiService } from '../../../services/aiService';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function DocumentAIActionsTab() {
  const { id: documentId } = useParams<{id: string}>()
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isExplainDialogOpen, setIsExplainDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [explainTopic, setExplainTopic] = useState('React JSX');
  const [summary, setSummary] = useState("")
  const [concept, setConcept] = useState("")


  const handleGenerateSummary = async () => {
    try {
      setIsLoading(true)
      if (!documentId) return;
      const response = await aiService.generateSummary(documentId as string)
      if (response.success) {
        setSummary(response.data)
        setIsSummaryDialogOpen(true)
        sileo.success({title: response.message})
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'An error occurred while generating summary'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplainConcept = async () => {
    try {
      setIsLoading(true)
      if (!documentId) return;
      const response = await aiService.explainConcept(documentId as string, explainTopic)
      if (response.success) {
        setConcept(response.data.explanation)
        setIsExplainDialogOpen(true)
        sileo.success({title: response.message})
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : 'An error occurred while generating concept'})
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-3xl border border-border/50 p-6 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg">AI Assistant</h2>
          <p className="text-muted-foreground text-sm">Powered by advanced AI</p>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Generate Summary</h3>
              <p className="text-muted-foreground text-sm">Get a concise summary of the entire document.</p>
            </div>
          </div>
          <button 
            onClick={() => handleGenerateSummary()}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Summarize"}
          </button>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Explain a Concept</h3>
            <p className="text-muted-foreground text-sm">Enter a topic or concept from the document to get a detailed explanation.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            value={explainTopic}
            onChange={(e) => setExplainTopic(e.target.value)}
            className="flex-1 px-5 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
          />
          <button 
            onClick={() => handleExplainConcept()}
            className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Explain"}
          </button>
        </div>
      </div>

      <Dialog
        isOpen={isSummaryDialogOpen}
        onClose={() => setIsSummaryDialogOpen(false)}
        title="Generated Summary"
        maxWidth="2xl"
      >
        <div className="mt-6 space-y-6 text-foreground/90 leading-relaxed overflow-x-hidden">
          <div className="markdown-container prose prose-lg max-w-none prose-slate dark:prose-invert 
            prose-p:leading-relaxed prose-pre:bg-black/10 prose-pre:p-3 prose-pre:rounded-lg prose-pre:border prose-pre:border-border/50
            prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
            prose-h1:font-bold prose-h2:font-bold prose-h3:font-semibold prose-h4:font-semibold
            prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground
            prose-li:marker:text-primary prose-a:text-primary hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
            prose-img:rounded-lg prose-img:shadow-lg prose-hr:border-t-2 prose-hr:border-border/50
            prose-table:w-full prose-table:table-auto prose-th:bg-muted/50 prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-border/50 prose-table:rounded-lg prose-table:border prose-table:border-border/50
            prose-code:break-words prose-pre:break-words
            p-6 rounded-xl bg-background border border-border/50 shadow-sm overflow-x-auto">
            <ReactMarkdown 
              components={{
                strong: ({node, ...props}) => <span className="font-bold text-primary" {...props} />,
                code: ({node, ...props}) => <code className="bg-muted/50 rounded px-2 py-1 font-mono text-sm border border-border/50 wrap-break-word" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-black/10 p-3 rounded-lg border border-border/50 overflow-x-auto wrap-break-word" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-foreground mb-4 pb-2 border-b border-border/50" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-foreground mb-3 mt-6" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-foreground mb-2 mt-4" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-foreground mb-2 mt-3" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-2 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="space-y-2 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="text-foreground leading-relaxed" {...props} />,
                p: ({node, ...props}) => <p className="text-foreground leading-relaxed mb-4" {...props} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>
      </Dialog>
      
      <Dialog
        isOpen={isExplainDialogOpen}
        onClose={() => setIsExplainDialogOpen(false)}
        title={`Explanation: ${explainTopic}`}
        maxWidth="2xl"
      >
        <div className="mt-6 space-y-6 text-foreground/90 leading-relaxed overflow-x-hidden">
          <div className="markdown-container prose prose-lg max-w-none prose-slate dark:prose-invert 
            prose-p:leading-relaxed prose-pre:bg-black/10 prose-pre:p-3 prose-pre:rounded-lg prose-pre:border prose-pre:border-border/50
            prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
            prose-h1:font-bold prose-h2:font-bold prose-h3:font-semibold prose-h4:font-semibold
            prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground
            prose-li:marker:text-primary prose-a:text-primary hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
            prose-img:rounded-lg prose-img:shadow-lg prose-hr:border-t-2 prose-hr:border-border/50
            prose-table:w-full prose-table:table-auto prose-th:bg-muted/50 prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-border/50 prose-table:rounded-lg prose-table:border prose-table:border-border/50
            prose-code:wrap-break-word prose-pre:wrap-break-word
            p-6 rounded-xl bg-background border border-border/50 shadow-sm overflow-x-auto">
            <ReactMarkdown 
              components={{
                strong: ({node, ...props}) => <span className="font-bold text-primary" {...props} />,
                code: ({node, ...props}) => <code className="bg-muted/50 rounded px-2 py-1 font-mono text-sm border border-border/50 wrap-break-word" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-black/10 p-3 rounded-lg border border-border/50 overflow-x-auto wrap-break-word" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-foreground mb-4 pb-2 border-b border-border/50" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-foreground mb-3 mt-6" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-foreground mb-2 mt-4" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-foreground mb-2 mt-3" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-2 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="space-y-2 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="text-foreground leading-relaxed" {...props} />,
                p: ({node, ...props}) => <p className="text-foreground leading-relaxed mb-4" {...props} />,
              }}
            >
              {concept}
            </ReactMarkdown>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
