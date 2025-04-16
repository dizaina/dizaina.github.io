import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  Plus 
} from "lucide-react";
import { 
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFiltersProps {
  onSearch: (searchTerm: string, field: "title" | "author" | "isbn") => void;
  onSortChange: (sortBy: string) => void;
  initialSearchTerm?: string;
  initialSearchField?: "title" | "author" | "isbn";
}

export function SearchFilters({ 
  onSearch, 
  onSortChange, 
  initialSearchTerm = "", 
  initialSearchField = "title" 
}: SearchFiltersProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchField, setSearchField] = useState<"title" | "author" | "isbn">(initialSearchField);

  const handleSearch = () => {
    onSearch(searchTerm, searchField);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            defaultValue={searchField}
            onValueChange={(value) => setSearchField(value as "title" | "author" | "isbn")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="isbn">ISBN</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleSearch}>
            Search
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onSortChange("title-asc")}>
                Title (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("title-desc")}>
                Title (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("author-asc")}>
                Author (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("author-desc")}>
                Author (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("year-desc")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("year-asc")}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <Link href="/add-book">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
