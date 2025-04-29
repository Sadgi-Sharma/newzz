import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeReducer from "./themeSlice";
import feedbackReducer from "./feedbackSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  feedback: feedbackReducer,
});

const persistedReducer = persistReducer(
  { key: "root", storage, whitelist: ["theme", "feedback"] },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
