import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { aiService } from '../../../services/aiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DocumentChatTab() {
  const { id: documentId } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I have analyzed this document. What would you like to know about it?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!documentId) return;
      
      try {
        setIsInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        
        if (response.success && response.data && response.data.length > 0) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !documentId || isLoading) return;

    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    try {
      const response = await aiService.chat(documentId!, question);

      if (response.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${ error instanceof Error ? error.message : String(error) || "Sorry, I encountered a network error."}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
<div className="bg-card rounded-3xl border border-border/50 overflow-hidden flex flex-col h-[700px] shadow-sm">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {isInitialLoading ? (
           <div className="flex justify-center items-center h-full">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : ''} gap-3`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={
                  msg.role === 'user' 
                    ? "bg-primary text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm"
                    : "bg-muted/50 border border-border/50 px-5 py-4 rounded-2xl rounded-tl-sm max-w-[80%] text-foreground leading-relaxed shadow-sm"
                }>
                  {/* Render Markdown for Assistant, plain text for User */}
                  {msg.role === 'assistant' ? (
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
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0 text-xs font-medium">
                    U
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/50 border border-border/50 px-5 py-4 rounded-2xl rounded-tl-sm text-foreground shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border/50 bg-card">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..." 
            disabled={isLoading || isInitialLoading}
            className="flex-1 px-5 py-3.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#00C48C]/50 transition-all shadow-sm disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isInitialLoading}
            className="bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white px-5 py-3.5 rounded-2xl transition-colors shadow-sm flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}