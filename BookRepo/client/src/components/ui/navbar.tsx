import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, UserCircle, ChevronDown, BookOpen, MessageSquare, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <header className="bg-primary shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="text-white mr-2 h-6 w-6" />
          <Link href="/">
            <h1 className="text-xl font-semibold text-white cursor-pointer">DevBookHub</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/books">
            <Button variant="ghost" className="text-white hover:bg-primary-dark">
              <BookOpen className="h-4 w-4 mr-2" />
              Books
            </Button>
          </Link>
          <Link href="/reviews">
            <Button variant="ghost" className="text-white hover:bg-primary-dark">
              <MessageSquare className="h-4 w-4 mr-2" />
              Reviews
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center">
          {!user ? (
            <div className="flex items-center">
              <Link href="/auth">
                <Button variant="outline" className="text-white border-white mr-2 hover:bg-white hover:text-primary">
                  Log In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  <div className="bg-secondary text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                    {getInitials(user.fullName || user.username)}
                  </div>
                  <span>{user.fullName || user.username}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/my-reviews">
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    My Reviews
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="ml-2 p-2 md:hidden text-white">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/books" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="flex justify-start w-full">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Books
                  </Button>
                </Link>
                <Link href="/reviews" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="flex justify-start w-full">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Reviews
                  </Button>
                </Link>
                {user && (
                  <Link href="/my-reviews" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="flex justify-start w-full">
                      <UserCircle className="mr-2 h-5 w-5" />
                      My Reviews
                    </Button>
                  </Link>
                )}
                <div className="border-t border-gray-200 pt-4">
                  {!user ? (
                    <div className="flex flex-col space-y-2">
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Log In</Button>
                      </Link>
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  ) : (
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
