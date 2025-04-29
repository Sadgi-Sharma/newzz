import { fetchNewsBySentiment } from "@/api/news_api";
import { NewsItem } from "@/types";
import { useEffect, useState } from "react";

export function useNewsBySentiment(sentiment: string, page: number) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError(null);
        if (!sentiment || sentiment === "") {
          setError("Sentiment is required");
          setNews([]);
          setTotalArticles(0);
          return;
        }
        const response = await fetchNewsBySentiment(sentiment, page);

        if (response.status === "success") {
          setNews(response.data);
          setTotalArticles(response.total_articles);
        } else {
          setError(response.message || "Failed to load news");
          setNews([]);
          setTotalArticles(0);
        }
      } catch (error) {
        console.error("Error fetching top news:", error);
        setError("Failed to load news");
        setNews([]);
        setTotalArticles(0);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [page, sentiment]);

  return { news, loading, error, totalArticles };
}
