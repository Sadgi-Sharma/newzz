export interface NewsItem {
  id: string;
  article_id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  keywords: string[] | null;
  image_url: string;
  source_url: string;
  source_name: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  confidence: number;
}

export interface NavItem {
  title: string;
  href: string;
}

export type ThemeMode = "light" | "dark";
