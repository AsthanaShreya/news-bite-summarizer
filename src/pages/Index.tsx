import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArticleInput } from "@/components/ArticleInput";
import { SummaryOutput } from "@/components/SummaryOutput";
import { SummaryHistory } from "@/components/SummaryHistory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SAMPLE_ARTICLE } from "@/utils/sampleArticle";

interface SummaryData {
  title: string;
  summaryPoints: string[];
  sentiment: "positive" | "negative" | "neutral";
  keywords: string[];
  wordCount: number;
  readingTimeMinutes: number;
}

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
  previewPoints: string[];
  fullData: SummaryData;
}

const Index = () => {
  const [articleText, setArticleText] = useState("");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("newsbite-history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  const saveToHistory = (summaryData: SummaryData) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      title: summaryData.title,
      timestamp: new Date().toISOString(),
      previewPoints: summaryData.summaryPoints.slice(0, 2),
      fullData: summaryData,
    };

    const newHistory = [historyItem, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem("newsbite-history", JSON.stringify(newHistory));
  };

  const handleSummarize = async () => {
    if (!articleText.trim()) {
      toast.error("Please paste an article to summarize");
      return;
    }

    if (articleText.trim().length < 50) {
      toast.error("Article must be at least 50 characters long");
      return;
    }

    setIsLoading(true);
    setSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke("summarize", {
        body: { text: articleText },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setSummary(data);
      saveToHistory(data);
      toast.success("Summary generated successfully!");
    } catch (error) {
      console.error("Error calling summarize function:", error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = () => {
    setArticleText(SAMPLE_ARTICLE);
    setSummary(null);
    toast.info("Sample article loaded. Click Summarize to see it in action!");
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSummary(item.fullData);
    toast.info("Loaded from history");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary">NewsBite</h1>
          <p className="text-muted-foreground mt-1">
            Turn long news articles into quick, readable summaries
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <Card className="p-6">
            <ArticleInput
              value={articleText}
              onChange={setArticleText}
              onSummarize={handleSummarize}
              onUseSample={handleUseSample}
              isLoading={isLoading}
            />
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <SummaryOutput summary={summary} />
          </Card>
        </div>

        {/* History Section */}
        <SummaryHistory history={history} onSelectHistory={handleSelectHistory} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Powered by Google Gemini AI
        </div>
      </footer>
    </div>
  );
};

export default Index;
