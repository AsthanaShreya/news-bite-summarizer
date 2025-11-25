import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SummaryData {
  title: string;
  summaryPoints: string[];
  sentiment: "positive" | "negative" | "neutral";
  keywords: string[];
  wordCount: number;
  readingTimeMinutes: number;
}

interface SummaryOutputProps {
  summary: SummaryData | null;
}

export const SummaryOutput = ({ summary }: SummaryOutputProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!summary) return;
    
    const text = summary.summaryPoints.join("\n• ");
    navigator.clipboard.writeText(`• ${text}`);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-positive text-positive-foreground";
      case "negative":
        return "bg-negative text-negative-foreground";
      default:
        return "bg-neutral text-neutral-foreground";
    }
  };

  if (!summary) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-6xl">✨</div>
          <p className="text-muted-foreground text-lg">
            Your summary will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {summary.title}
        </h2>
        
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={`${getSentimentColor(summary.sentiment)} capitalize`}>
            {summary.sentiment}
          </Badge>
          
          <span className="text-sm text-muted-foreground">
            {summary.wordCount} words • {summary.readingTimeMinutes} min read
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Summary</h3>
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-8"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Summary
              </>
            )}
          </Button>
        </div>
        
        <ul className="space-y-2">
          {summary.summaryPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="text-accent mr-2 mt-1">•</span>
              <span className="text-foreground leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {summary.keywords.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {summary.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs"
              >
                #{keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};