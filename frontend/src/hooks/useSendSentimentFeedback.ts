import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { sendFeedbackSentiment } from "@/api/news_api";
import { submitFeedback } from "@/store/feedbackSlice";
import { useState } from "react";

export function useSendSentimentFeedback() {
  const dispatch = useDispatch();
  const feedback = useSelector(
    (state: RootState) => state.feedback.feedbackByArticleId
  );
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const sendFeedback = async (
    articleId: string,
    sentiment: "positive" | "negative" | "neutral"
  ) => {
    if (feedback[articleId]) {
      console.warn("Feedback already submitted for this article");
      return;
    }
    if (loadingMap[articleId]) {
      console.warn("Feedback already being sent for this article");
      return;
    }
    setLoadingMap((prev) => ({ ...prev, [articleId]: true }));
    try {
      const response = await sendFeedbackSentiment(articleId, sentiment);
      console.log(response);
      dispatch(submitFeedback({ articleId, sentiment }));
    } catch (error) {
      console.error("Error sending feedback:", error);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [articleId]: false }));
    }
  };
  return { sendFeedback, feedback, loadingMap };
}
