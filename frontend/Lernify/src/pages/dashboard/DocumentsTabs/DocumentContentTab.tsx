import { ExternalLink } from 'lucide-react';

export default function DocumentContentTab({ fileUrl }: { fileUrl?: string }) {
  

  return (
    <div className="bg-card rounded-3xl border border-border/50 overflow-hidden flex flex-col h-[700px] shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
        <span className="font-medium text-foreground">Document Viewer</span>
        {fileUrl && (
          <a 
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </a>
        )}
      </div>
      
      {/* Native PDF Viewer */}
      {fileUrl ? (
        <div className="flex-1 w-full h-full bg-zinc-100/50">
          <iframe 
            src={fileUrl}
            className="w-full h-full border-0"
            title="PDF Document Viewer"
          />
        </div>
      ) : (
        <div className="flex-1 w-full h-full bg-zinc-100/50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No document file available</p>
          </div>
        </div>
      )}
    </div>
  );
}