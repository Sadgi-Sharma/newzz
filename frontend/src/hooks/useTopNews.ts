import { fetchTopNews } from "@/api/news_api";
import { NewsItem } from "@/types";
import { useEffect, useState } from "react";

export function useTopNews(page: number) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchTopNews(page);

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
  }, [page]);

  return { news, loading, error, totalArticles };
}
