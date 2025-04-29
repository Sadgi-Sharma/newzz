import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FeedbackState = {
  feedbackByArticleId: Record<string, "positive" | "negative" | "neutral">;
};

const initialState: FeedbackState = {
  feedbackByArticleId: {},
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    submitFeedback(
      state,
      action: PayloadAction<{
        articleId: string;
        sentiment: "positive" | "negative" | "neutral";
      }>
    ) {
      const { articleId, sentiment } = action.payload;
      state.feedbackByArticleId[articleId] = sentiment;
    },
  },
});

export const { submitFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
