import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Review, User, Book } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  StarIcon, 
  BookOpen, 
  ThumbsUp, 
  Pencil, 
  Trash2, 
  ChevronRight
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  book?: Book;
  user?: User;
  showBook?: boolean;
}

export function ReviewCard({ review, book, user, showBook = true }: ReviewCardProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [helpfulCount, setHelpfulCount] = useState<number>(0);
  const [isHelpful, setIsHelpful] = useState<boolean>(false);

  const isAuthor = currentUser?.id === review.userId;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', `/api/reviews/${review.id}`);
      return res;
    },
    onSuccess: () => {
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted successfully.',
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/books', review.bookId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', review.userId, 'reviews'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete review: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const handleDeleteReview = () => {
    deleteMutation.mutate();
  };

  const handleHelpfulClick = () => {
    // In a real app, this would make an API call to mark review as helpful
    setIsHelpful(!isHelpful);
    setHelpfulCount(prevCount => isHelpful ? prevCount - 1 : prevCount + 1);
  };

  // Render rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex text-amber-500">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-current' : 'stroke-current fill-transparent'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-4 md:mb-0">
            {showBook && (
              <>
                <div className="flex items-center mb-1">
                  <BookOpen className="text-amber-500 h-5 w-5" />
                  <h3 className="font-medium text-neutral-800 ml-1">
                    {book ? (
                      <Link href={`/books/${book.id}`}>
                        <span className="hover:underline cursor-pointer">
                          {book.title}
                        </span>
                      </Link>
                    ) : (
                      `Book #${review.bookId}`
                    )}
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm mb-2">
                  {book ? `by ${book.author}` : ''}
                </p>
              </>
            )}
            
            <div className="mb-3">
              {renderRating(review.rating)}
            </div>
            
            <div className="flex items-center">
              <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                {user?.fullName?.[0] || user?.username?.[0] || 'A'}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.fullName || user?.username || 'Anonymous'}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4 md:pl-6 md:border-l md:border-neutral-200">
            {review.title && (
              <h4 className="font-medium text-neutral-800 mb-2">{review.title}</h4>
            )}
            <p className="text-neutral-700 mb-4">{review.content}</p>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-neutral-500 hover:text-neutral-700"
                onClick={handleHelpfulClick}
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${isHelpful ? 'fill-current' : ''}`} />
                Helpful {helpfulCount > 0 ? `(${helpfulCount})` : ''}
              </Button>
              
              <div className="flex items-center">
                {showBook && book && (
                  <Link href={`/books/${book.id}`}>
                    <Button variant="link" size="sm" className="text-primary hover:text-primary-dark">
                      View Book
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                )}
                
                {isAuthor && (
                  <div className="ml-4 flex">
                    <Link href={`/reviews/edit/${review.id}`}>
                      <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-700 mr-2">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your review.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteReview}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
