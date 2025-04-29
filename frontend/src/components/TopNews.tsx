import { useState } from "react";
import { useTopNews } from "@/hooks/useTopNews";
import { useNewsBySentiment } from "@/hooks/useNewsBySentiment";
import NewsCard from "./NewsCard";
import SkeletonLoader from "./SkeletonNewsCard";
import { Button } from "./ui/button";

function TopNews() {
  const [page, setPage] = useState(1);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(
    null
  );

  const topNews = useTopNews(page);
  const sentimentNews = useNewsBySentiment(selectedSentiment ?? "", page);

  const isSentimentSelected = !!selectedSentiment;

  const newsData = isSentimentSelected ? sentimentNews : topNews;
  const { news, loading, error, totalArticles } = newsData;

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    const totalPages = Math.ceil(totalArticles / 20);
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const toggleSentiment = (sentiment: string) => {
    setSelectedSentiment((prev) => (prev === sentiment ? null : sentiment));
    setPage(1);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-bold text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 mb-8 text-center">
        Top News
      </h1>

      {/* Sentiment Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {["Positive", "Negative", "Neutral"].map((sentiment) => (
          <Button
            key={sentiment}
            variant={selectedSentiment === sentiment ? "default" : "outline"}
            className="text-sm"
            onClick={() => toggleSentiment(sentiment)}
          >
            {sentiment}
          </Button>
        ))}
      </div>

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonLoader key={idx} />
            ))
          : news.map((article, idx) => (
              <NewsCard article={article} key={idx} />
            ))}
      </div>

      {!loading && news.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button onClick={handlePrevious} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Button
            onClick={handleNext}
            disabled={page >= Math.ceil(totalArticles / 20)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}

export default TopNews;
