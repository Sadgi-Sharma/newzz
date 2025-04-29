import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useApplyTheme() {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [mode]);
}
