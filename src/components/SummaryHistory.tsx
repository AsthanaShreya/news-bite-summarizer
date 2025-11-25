import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
  previewPoints: string[];
}

interface SummaryHistoryProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

export const SummaryHistory = ({ history, onSelectHistory }: SummaryHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-2">Recent Summaries</h3>
        <p className="text-sm text-muted-foreground">
          Your summarization history will appear here
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-foreground mb-4">Recent Summaries</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {item.previewPoints.slice(0, 2).map((point, idx) => (
                  <li key={idx} className="truncate">• {point}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};