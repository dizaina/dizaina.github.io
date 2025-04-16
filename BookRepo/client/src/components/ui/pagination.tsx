import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers = [];
    
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than the max to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, current page, and one page before and after current
      pageNumbers.push(1);
      
      if (currentPage > 2) {
        pageNumbers.push(currentPage - 1);
      }
      
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      
      if (currentPage < totalPages - 1) {
        pageNumbers.push(currentPage + 1);
      }
      
      pageNumbers.push(totalPages);
      
      // Add ellipses where needed
      const uniquePageNumbers = Array.from(new Set(pageNumbers)).sort((a, b) => a - b);
      const result = [];
      
      for (let i = 0; i < uniquePageNumbers.length; i++) {
        result.push(uniquePageNumbers[i]);
        
        // Add ellipsis if there's a gap
        if (i < uniquePageNumbers.length - 1 && uniquePageNumbers[i + 1] - uniquePageNumbers[i] > 1) {
          result.push("ellipsis");
        }
      }
      
      return result;
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <Button
          variant="outline"
          size="icon"
          className="rounded-l-md"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                disabled
              >
                ...
              </Button>
            );
          }
          
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page as number)}
              className={currentPage === page ? "bg-primary text-white" : ""}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-r-md"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </nav>
    </div>
  );
}
