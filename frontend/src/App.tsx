import Header from "./components/Header";
import TopNews from "./components/TopNews";
import { useApplyTheme } from "./hooks/useApplyTheme";

function App() {
  useApplyTheme();
  return (
    <div className="p-6 min-h-screen">
      <Header />
      <TopNews />
    </div>
  );
}

export default App;
