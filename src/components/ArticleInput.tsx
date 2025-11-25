import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ArticleInputProps {
  value: string;
  onChange: (value: string) => void;
  onSummarize: () => void;
  onUseSample: () => void;
  isLoading: boolean;
}

export const ArticleInput = ({
  value,
  onChange,
  onSummarize,
  onUseSample,
  isLoading,
}: ArticleInputProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-2">Article Text</h2>
        <p className="text-sm text-muted-foreground">
          Paste your news article below to get an instant AI-powered summary
        </p>
      </div>
      
      <Textarea
        id="articleInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the news article text here..."
        className="flex-1 min-h-[300px] resize-none font-serif text-sm leading-relaxed"
        disabled={isLoading}
      />
      
      <div className="flex gap-3 mt-4">
        <Button
          onClick={onSummarize}
          disabled={isLoading || !value.trim()}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            "Summarize"
          )}
        </Button>
        
        <Button
          onClick={onUseSample}
          disabled={isLoading}
          variant="outline"
          size="lg"
        >
          Use Sample Article
        </Button>
      </div>
    </div>
  );
};