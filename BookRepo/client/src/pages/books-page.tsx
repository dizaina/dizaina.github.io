import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BookList } from "@/components/books/book-list";

export default function BooksPage() {
  const [searchParams] = useState(() => {
    // In a real app, we might get these from URL params
    return {
      query: "",
      field: "title" as "title" | "author" | "isbn"
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900">Books</h1>
          <p className="text-neutral-600">
            Browse our collection of programming and technical books.
          </p>
        </div>
        
        <BookList searchQuery={searchParams.query} searchField={searchParams.field} />
      </main>
      
      <Footer />
    </div>
  );
}
