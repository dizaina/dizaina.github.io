import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@shared/schema";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
import { BookOpen, MessageSquare, Search, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  // Fetch latest books
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });
  
  // Show only the most recent 3 books
  const latestBooks = books?.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover and Review Developer Books
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Your platform for finding, reviewing, and discussing the best programming and technical books with your team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/books">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Browse Books
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for Technical Literature</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Extensive Book Collection</h3>
                <p className="text-neutral-600">
                  Browse through carefully curated programming and technical books organized by topics and technologies.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Insightful Reviews</h3>
                <p className="text-neutral-600">
                  Read detailed reviews from developers like you or contribute your own thoughts to help others.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
                <p className="text-neutral-600">
                  Share recommendations with your team and build a collective knowledge base of technical literature.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Latest Books Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Latest Books</h2>
              <Link href="/books">
                <Button variant="outline">View All Books</Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestBooks?.map((book) => (
                  <BookCard key={book.id} book={book} averageRating={4.8} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Discovering?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our community of developers and start exploring the best technical books tailored for your needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/books">
                <Button size="lg" className="bg-primary text-white">
                  <Search className="mr-2 h-5 w-5" />
                  Search Books
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
