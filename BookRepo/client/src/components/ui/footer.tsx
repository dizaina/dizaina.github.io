import { Link } from "wouter";
import { BookOpen, Twitter, Github, Linkedin, HelpCircle, Settings } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <BookOpen className="text-white mr-2 h-6 w-6" />
              <h2 className="text-xl font-semibold text-white">DevBookHub</h2>
            </div>
            <p className="text-neutral-400 max-w-md">
              A platform for developers to discover, review, and discuss technical books with their team and clients.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-medium mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/books" className="text-neutral-400 hover:text-white transition-colors duration-200">Books</Link></li>
                <li><Link href="/reviews" className="text-neutral-400 hover:text-white transition-colors duration-200">Reviews</Link></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} DevBookHub. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">
              <HelpCircle className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
