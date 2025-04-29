import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Toggle } from "./ui/toggle";
import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/store/themeSlice";
import { Button } from "./ui/button";

function Header() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="ml-2 text-2xl font-bold">Newzz</h1>
      <div className="flex items-center gap-4">
        <Button variant="link" size="lg">
          About
        </Button>

        <Toggle
          pressed={theme === "dark"}
          onClick={() => dispatch(toggleTheme())}
          className="border border-gray-300 dark:border-gray-700"
        >
          {theme === "light" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Toggle>
      </div>
    </div>
  );
}

export default Header;
