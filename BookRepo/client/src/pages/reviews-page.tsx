import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { Review, Book, User } from "@shared/schema";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ReviewCard } from "@/components/reviews/review-card";
import { Pagination } from "@/components/ui/pagination";
import { 
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsPage() {
  const [_, navigate] = useLocation();
  const params = useParams();
  const { user } = useAuth();
  const isMyReviews = window.location.pathname === "/my-reviews";
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  const reviewsPerPage = 5;
  
  // Fetch all reviews
  const { data: reviews, isLoading: isLoadingReviews, error: reviewsError } = useQuery<Review[]>({
    queryKey: isMyReviews ? [`/api/users/${user?.id}/reviews`] : ["/api/books/reviews"],
    enabled: !isMyReviews || (isMyReviews && !!user?.id),
  });
  
  // Since we don't have a reviews endpoint in the API, we'll fetch reviews for each book
  const { data: books, isLoading: isLoadingBooks } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });
  
  // Mock users data (in a real app, we'd fetch users)
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: false, // Disabled as we don't have an endpoint to fetch all users
  });
  
  // Get all reviews from all books if not on my-reviews page
  const getAllReviews = () => {
    if (isMyReviews) {
      return reviews || [];
    }
    
    if (!books) return [];
    
    const allReviews: Review[] = [];
    books.forEach(book => {
      // Mock reviews for each book
      if (reviews) {
        const bookReviews = reviews.filter(review => review.bookId === book.id);
        allReviews.push(...bookReviews);
      }
    });
    
    return allReviews;
  };
  
  const allReviews = getAllReviews();
  
  // Filter reviews based on search term
  const filteredReviews = allReviews.filter(review => {
    if (!searchTerm) return true;
    
    const book = books?.find(b => b.id === review.bookId);
    const term = searchTerm.toLowerCase();
    
    return (
      book?.title.toLowerCase().includes(term) ||
      book?.author.toLowerCase().includes(term) ||
      review.content.toLowerCase().includes(term) ||
      review.title?.toLowerCase().includes(term)
    );
  });
  
  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });
  
  // Paginate reviews
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page on sort change
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get book and user data for each review
  const getBookForReview = (bookId: number) => {
    if (!books) return null;
    return books.find(book => book.id === bookId);
  };
  
  const getUserForReview = (userId: number) => {
    if (!users) return null;
    return users.find(user => user.id === userId);
  };
  
  const isLoading = isLoadingReviews || isLoadingBooks;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900">
            {isMyReviews ? "My Reviews" : "Book Reviews"}
          </h1>
          <p className="text-neutral-600">
            {isMyReviews 
              ? "View and manage your book reviews." 
              : "Read reviews from the developer community."}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                className="pl-10"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                defaultValue={sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">
                Search
              </Button>
            </div>
          </form>
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
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
        ) : reviewsError ? (
          <div className="text-center py-10">
            <p className="text-red-500">Error loading reviews: {reviewsError.message}</p>
          </div>
        ) : paginatedReviews.length > 0 ? (
          <div className="space-y-6">
            {paginatedReviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                book={getBookForReview(review.bookId)} 
                user={getUserForReview(review.userId)} 
              />
            ))}
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <p className="text-neutral-500 mb-2">
              {searchTerm 
                ? "No reviews found matching your search criteria." 
                : isMyReviews 
                  ? "You haven't written any reviews yet." 
                  : "No reviews available."}
            </p>
            {isMyReviews && (
              <Button onClick={() => navigate("/books")}>
                Browse Books to Review
              </Button>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
