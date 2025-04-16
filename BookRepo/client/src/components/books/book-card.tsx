import { Book } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface BookCardProps {
  book: Book;
  averageRating?: number;
}

export function BookCard({ book, averageRating = 0 }: BookCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">
            {book.title}
          </h3>
          {averageRating > 0 && (
            <Badge variant="secondary" className="ml-2 flex items-center bg-amber-500 text-white">
              <Star className="h-3 w-3 mr-0.5" />
              {averageRating.toFixed(1)}
            </Badge>
          )}
        </div>
        <p className="text-neutral-600 mb-2">by {book.author}</p>
        {book.isbn && <p className="text-sm text-neutral-500 mb-4">ISBN: {book.isbn}</p>}
        {book.description && (
          <p className="text-neutral-700 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>
        )}
        <div className="mt-auto">
          <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
            <span className="text-sm text-neutral-500">
              Published: {book.publicationYear || "Unknown"}
            </span>
            <Link href={`/books/${book.id}`}>
              <div className="text-primary flex items-center text-sm hover:text-primary-dark cursor-pointer">
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
