import { NewsItem } from "@/types";
import apiClient from "./apiClient";

export interface TopNewsSuccessResponse {
  status: "success";
  page: number;
  limit: number;
  total_articles: number;
  data: NewsItem[];
}

export interface TopNewsErrorResponse {
  status: "error";
  message: string;
}

export type TopNewsResponse = TopNewsSuccessResponse | TopNewsErrorResponse;

export async function fetchTopNews(page: number): Promise<TopNewsResponse> {
  try {
    const params = {
      page,
      limit: 20,
    };

    const response = await apiClient.get<TopNewsResponse>("/news/top-news", {
      params,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching top news:", error);

    return {
      status: "error",
      message:
        error?.response?.data?.message || "An unexpected error occurred.",
    };
  }
}

export async function fetchNewsBySentiment(
  sentiment: string,
  page: number
): Promise<TopNewsResponse> {
  try {
    const params = {
      sentiment,
      page,
      limit: 20,
    };

    const response = await apiClient.get<TopNewsResponse>(
      "/news/sentiment-news",
      { params }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching news by sentiment:", error);

    return {
      status: "error",
      message:
        error?.response?.data?.message || "An unexpected error occurred.",
    };
  }
}

export async function sendFeedbackSentiment(
  article_id: string,
  sentiment: string
) {
  try {
    const response = await apiClient.post("/news/give-feedback", {
      article_id,
      sentiment,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending feedback sentiment:", error);

    return {
      status: "error",
      message: error || "An unexpected error occurred.",
    };
  }
}
