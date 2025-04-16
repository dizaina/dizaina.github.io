import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Book, Review, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewForm } from "@/components/reviews/review-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Book as BookIcon, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id, 10);
  const [_, navigate] = useLocation();
  const { user } = useAuth();

  // Fetch book details
  const { data: book, isLoading: isLoadingBook, error: bookError } = useQuery<Book>({
    queryKey: [`/api/books/${bookId}`],
    enabled: !isNaN(bookId)
  });

  // Fetch book reviews
  const { 
    data: reviews, 
    isLoading: isLoadingReviews, 
    error: reviewsError 
  } = useQuery<Review[]>({
    queryKey: [`/api/books/${bookId}/reviews`],
    enabled: !isNaN(bookId)
  });

  // Fetch user data for each review
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: false, // Disabled as we don't have an endpoint to fetch all users
  });

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Check if the current user has already reviewed this book
  const hasUserReviewed = reviews?.some(review => review.userId === user?.id);

  // Dialog open state for review form
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  if (isNaN(bookId)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="text-center py-10">
            <p className="text-red-500">Invalid book ID.</p>
            <Button asChild className="mt-4">
              <Link href="/books">Back to Books</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (bookError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="text-center py-10">
            <p className="text-red-500">Error loading book: {bookError.message}</p>
            <Button asChild className="mt-4">
              <Link href="/books">Back to Books</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getUserForReview = (userId: number) => {
    if (!users) return null;
    return users.find(user => user.id === userId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Link href="/books">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
        </Link>
        
        {isLoadingBook ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                <Skeleton className="h-64 w-full rounded-lg mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="md:w-2/3">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-4" />
              </div>
            </div>
          </div>
        ) : book ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                  <div className="bg-neutral-100 h-56 md:h-64 flex items-center justify-center rounded-lg mb-4">
                    <BookIcon className="h-20 w-20 text-neutral-400" />
                  </div>
                  <div className="flex justify-between">
                    <div className="bg-amber-500 text-white rounded-md px-3 py-1 text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {averageRating.toFixed(1)} ({reviews?.length || 0} reviews)
                    </div>
                    <div className="text-sm text-neutral-600">
                      Published: {book.publicationYear || "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">{book.title}</h2>
                  <p className="text-neutral-700 text-lg mb-2">
                    by <span className="font-medium">{book.author}</span>
                  </p>
                  {book.isbn && (
                    <p className="text-sm text-neutral-500 mb-4">ISBN: {book.isbn}</p>
                  )}
                  
                  <div className="mb-6 pb-4 border-b border-neutral-200">
                    <h3 className="font-medium text-neutral-800 mb-2">Description</h3>
                    <p className="text-neutral-700">
                      {book.description || "No description available."}
                    </p>
                  </div>
                  
                  <Tabs defaultValue="reviews">
                    <TabsList>
                      <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="reviews" className="mt-4">
                      {user && !hasUserReviewed && (
                        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="mb-4">
                              Write a Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Write a Review for {book.title}</DialogTitle>
                            </DialogHeader>
                            <ReviewForm 
                              bookId={book.id} 
                              onSuccess={() => {
                                setReviewDialogOpen(false);
                                queryClient.invalidateQueries({ queryKey: [`/api/books/${bookId}/reviews`] });
                              }} 
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      {isLoadingReviews ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="border rounded-lg p-5">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4 mb-4 md:mb-0">
                                  <Skeleton className="h-4 w-3/4 mb-2" />
                                  <Skeleton className="h-4 w-1/2 mb-3" />
                                  <Skeleton className="h-6 w-24 mb-3" />
                                  <div className="flex items-center">
                                    <Skeleton className="h-8 w-8 rounded-full mr-2" />
                                    <div>
                                      <Skeleton className="h-4 w-20 mb-1" />
                                      <Skeleton className="h-3 w-16" />
                                    </div>
                                  </div>
                                </div>
                                <div className="md:w-3/4 md:pl-6 md:border-l md:border-neutral-200">
                                  <Skeleton className="h-5 w-1/2 mb-2" />
                                  <Skeleton className="h-4 w-full mb-1" />
                                  <Skeleton className="h-4 w-full mb-1" />
                                  <Skeleton className="h-4 w-4/5 mb-4" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : reviews && reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map(review => (
                            <ReviewCard 
                              key={review.id} 
                              review={review} 
                              book={book} 
                              user={getUserForReview(review.userId)} 
                              showBook={false}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed rounded-lg">
                          <BookIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-neutral-800 mb-2">No reviews yet</h3>
                          <p className="text-neutral-600">
                            Be the first to review this book and share your thoughts!
                          </p>
                          {user && (
                            <Button 
                              className="mt-4" 
                              onClick={() => setReviewDialogOpen(true)}
                            >
                              Write a Review
                            </Button>
                          )}
                          {!user && (
                            <div className="mt-4">
                              <p className="text-sm text-neutral-500 mb-2">
                                You need to be logged in to write a review
                              </p>
                              <Link href="/auth">
                                <Button variant="outline">Log In or Sign Up</Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-neutral-500">Book not found.</p>
            <Button asChild className="mt-4">
              <Link href="/books">Back to Books</Link>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

// Import useState at the top
import { useState } from "react";
