import { useState } from "react";
import { NewsItem } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ArrowUpRight, Loader2, ThumbsUp } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useSendSentimentFeedback } from "@/hooks/useSendSentimentFeedback";

export default function NewsCard({ article }: { article: NewsItem }) {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { sendFeedback, feedback, loadingMap } = useSendSentimentFeedback();

  const feedbackSentiment = feedback[article.article_id];
  const isLoading = loadingMap[article.article_id];

  const SentimentBadge = (
    <Badge
      variant="outline"
      title={`Confidence: ${(article.confidence * 100).toFixed(1)}%`}
      className={
        article.sentiment === "Positive"
          ? "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-600 dark:bg-green-900"
          : article.sentiment === "Negative"
          ? "text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-600 dark:bg-red-900"
          : "text-gray-700 border-gray-300 bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-900"
      }
    >
      {article.sentiment}
    </Badge>
  );

  const Keywords = (
    <div className="flex flex-wrap gap-2">
      {article.keywords &&
        article.keywords.map((keyword, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs capitalize">
            {keyword}
          </Badge>
        ))}
    </div>
  );

  const ExternalLinkButton = ({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) => (
    <Button
      asChild
      variant="link"
      className="p-0 h-auto text-blue-600 dark:text-blue-400"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
        <ArrowUpRight className="ml-1 h-4 w-4" />
      </a>
    </Button>
  );

  const ExpandedDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400"
        >
          Read more...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6">
        {!imageLoaded && <Skeleton className="w-full h-56 rounded-lg mb-4" />}
        <img
          src={article.image_url}
          alt={article.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-56 object-cover rounded-lg mb-4 transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <div className="text-muted-foreground text-sm mb-4 flex items-center gap-2">
          <span>
            {new Date(article.pubDate).toLocaleString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          {SentimentBadge}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 whitespace-pre-line">
          {article.description}
        </p>
        <div className="mb-6">{Keywords}</div>
        <ExternalLinkButton href={article.link} label="Read Full Article" />

        <div className="mt-8 p-4 border-t dark:border-gray-700">
          <p className="text-sm font-medium mb-2">
            Does the sentiment seem wrong?
          </p>
          {!feedbackSentiment ? (
            <div className="flex flex-wrap gap-2">
              {["Positive", "Negative", "Neutral"].map((sentiment) => (
                <Button
                  key={sentiment}
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                  className={`text-xs ${
                    sentiment === "Positive"
                      ? "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-600 dark:bg-green-900"
                      : sentiment === "Negative"
                      ? "text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-600 dark:bg-red-900"
                      : "text-gray-700 border-gray-300 bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-900"
                  }`}
                  onClick={() => {
                    sendFeedback(
                      article.article_id,
                      sentiment.toLowerCase() as any
                    );
                  }}
                >
                  {" "}
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    sentiment
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm mt-2">
              <ThumbsUp className="h-4 w-4" />
              <span>Thanks for your feedback! ({feedbackSentiment})</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="rounded-2xl pt-0 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="relative">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-48 rounded-t-2xl" />
        )}
        <img
          src={article.image_url}
          alt={article.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-48 object-cover transition-transform duration-500 transform hover:scale-105 rounded-t-2xl ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>
            {new Date(article.pubDate).toLocaleString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          {SentimentBadge}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100 mb-2">
          {article.title}
        </h2>

        {/* Description + Read More */}
        <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1 flex-1">
          <p className="line-clamp-3">{article.description}</p>
          {ExpandedDialog}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center pt-2 border-t dark:border-gray-700">
          <ExternalLinkButton href={article.link} label="Visit Source" />
          <span className="text-xs text-muted-foreground truncate max-w-[8rem] text-right">
            {article.source_name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
