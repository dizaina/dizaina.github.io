import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@shared/schema";
import { BookCard } from "@/components/books/book-card";
import { SearchFilters } from "@/components/books/search-filters";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface BookListProps {
  searchQuery?: string;
  searchField?: "title" | "author" | "isbn";
}

export function BookList({ searchQuery = "", searchField = "title" }: BookListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [field, setField] = useState(searchField);
  const [sortBy, setSortBy] = useState<string>("title-asc");
  
  const booksPerPage = 6;

  // Fetch books
  const { data: books, isLoading, error } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  // Filter books based on search term and field
  const filteredBooks = books?.filter(book => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    switch (field) {
      case "title":
        return book.title.toLowerCase().includes(term);
      case "author":
        return book.author.toLowerCase().includes(term);
      case "isbn":
        return book.isbn?.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  // Sort books based on sortBy value
  const sortedBooks = [...(filteredBooks || [])].sort((a, b) => {
    switch (sortBy) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "author-asc":
        return a.author.localeCompare(b.author);
      case "author-desc":
        return b.author.localeCompare(a.author);
      case "year-asc":
        return (a.publicationYear || 0) - (b.publicationYear || 0);
      case "year-desc":
        return (b.publicationYear || 0) - (a.publicationYear || 0);
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil((sortedBooks?.length || 0) / booksPerPage);
  const paginatedBooks = sortedBooks?.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handleSearch = (term: string, selectedField: "title" | "author" | "isbn") => {
    setSearchTerm(term);
    setField(selectedField);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading books: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchFilters 
        onSearch={handleSearch} 
        onSortChange={handleSortChange} 
        initialSearchTerm={searchTerm}
        initialSearchField={field}
      />

      {isLoading ? (
        // Loading skeleton for books
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 h-80">
              <Skeleton className="h-7 w-4/5 mb-3" />
              <Skeleton className="h-5 w-2/3 mb-4" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="mt-auto">
                <div className="border-t border-neutral-200 pt-3 flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {paginatedBooks && paginatedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} averageRating={4.7} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-neutral-500">No books found matching your search criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
