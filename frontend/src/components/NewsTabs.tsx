import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { setCategory } from "@/store/newsSlice";

const categories = ["World", "Business", "Technology", "Sports", "Health"];
const sentiment = ["Neutral", "Positive", "Negative"];

function NewsTabs({
  news,
}: {
  news: {
    title: string;
    category: string;
    sentiment: string;
    content: string;
  }[];
}) {
  const dispatch = useDispatch();
  const { selectedCategory, selectedSentiment } = useSelector(
    (state: RootState) => state.news
  );
  return (
    <Tabs
      defaultValue={categories[0]}
      value={selectedCategory}
      onValueChange={(val) => dispatch(setCategory(val))}
    >
      <TabsList className="grid grid-cols-5">
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat}>
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default NewsTabs;
