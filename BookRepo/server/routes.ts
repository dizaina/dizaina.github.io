import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { initializeData } from "./files";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { bookSchema, reviewSchema } from "@shared/schema";

// Middleware to check if the user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize data files with sample data if needed
  await initializeData();
  
  // Set up authentication routes
  setupAuth(app);

  // Task 1: Get the book list available in the shop.
  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

 // Task 2: Get the books based on ISBN
  app.get("/api/books/isbn/:isbn", async (req, res, next) => {
      try {
        const book = await storage.getBookByISBN(req.params.isbn);
        if (!book) {
          return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
      } catch (error) {
        next(error);
      }
    });
  
    // Task 3: Get all books by Author
    app.get("/api/books/author/:author", async (req, res, next) => {
      try {
        const books = await storage.getBooksByAuthor(req.params.author);
        res.json(books);
      } catch (error) {
        next(error);
      }
    });
  
    // Task 4: Get all books based on Title
    app.get("/api/books/title/:title", async (req, res, next) => {
      try {
        const books = await storage.getBooksByTitle(req.params.title);
        res.json(books);
      } catch (error) {
        next(error);
      }
    });
    
  //Task 5: Get book Review.
  app.get("/api/books/:bookId/reviews", async (req, res) => {
    try {
      const bookId = parseInt(req.params.bookId, 10);
      const reviews = await storage.getReviewsByBookId(bookId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
    //Task 8: Add/Modify a book review
    app.put("/api/reviews/:id", isAuthenticated, async (req, res) => {
      try {
        const id = parseInt(req.params.id, 10);
        const review = await storage.getReview(id);
        
        if (!review) {
          return res.status(404).json({ message: "Review not found" });
        }
        
        // Only allow the author of the review to update it
        if (review.userId !== req.user?.id) {
          return res.status(403).json({ message: "Not authorized to update this review" });
        }
        
        const reviewData = reviewSchema.parse({
          ...req.body,
          bookId: review.bookId,
          userId: req.user?.id
        });
        
        const updatedReview = await storage.updateReview(id, reviewData);
        res.json(updatedReview);
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ message: validationError.message });
        }
        
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Failed to update review" });
      }
    });
  
    //Task 9: Delete book review added by that particular user 
    app.delete("/api/reviews/:id", isAuthenticated, async (req, res) => {
      try {
        const id = parseInt(req.params.id, 10);
        const review = await storage.getReview(id);
        
        if (!review) {
          return res.status(404).json({ message: "Review not found" });
        }
        
        // Only allow the author of the review to delete it
        if (review.userId !== req.user?.id) {
          return res.status(403).json({ message: "Not authorized to delete this review" });
        }
        
        const deleted = await storage.deleteReview(id);
        
        if (deleted) {
          res.status(204).end();
        } else {
          res.status(404).json({ message: "Review not found" });
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Failed to delete review" });
      }
    });
   //Task 10: Get all books – Using async callback function 
   app.get("/api/books/search", async (req, res, next) => {
    try {
      const query = req.query.q as string || "";
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }
  
      const books = await storage.searchBooks(query);
      res.json(books);
    } catch (error) {
      next(error);
    }
  });
  
//Task 11: Search by ISBN – Using Promises
app.get("/api/books/search/isbn", async (req, res) => {
  try {
    const isbn = req.query.q as string || "";
    const book = await storage.getBookByISBN(isbn);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(book);
  } catch (error) {
    console.error("Error searching book by ISBN:", error);
    res.status(500).json({ message: "Failed to search book" });
  }
});

//Task 12: Search by Author
app.get("/api/books/search/author", async (req, res) => {
  try {
    const author = req.query.q as string || "";
    const books = await storage.getBooksByAuthor(author);
    res.json(books);
  } catch (error) {
    console.error("Error searching books by author:", error);
    res.status(500).json({ message: "Failed to search books" });
  }
});

//Task 13: Search by Title
  app.get("/api/books/search/title", async (req, res) => {
    try {
      const title = req.query.q as string || "";
      const books = await storage.getBooksByTitle(title);
      res.json(books);
    } catch (error) {
      console.error("Error searching books by title:", error);
      res.status(500).json({ message: "Failed to search books" });
    }
  });


  app.post("/api/books", isAuthenticated, async (req, res) => {
    try {
      const bookData = bookSchema.parse({
        ...req.body,
        addedBy: req.user?.id
      });
      
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Failed to create book" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const book = await storage.getBook(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  app.put("/api/books/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const book = await storage.getBook(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Only allow the user who added the book or admins to update it
      if (book.addedBy && book.addedBy !== req.user?.id) {
        return res.status(403).json({ message: "Not authorized to update this book" });
      }
      
      const bookData = bookSchema.parse(req.body);
      const updatedBook = await storage.updateBook(id, bookData);
      
      res.json(updatedBook);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const book = await storage.getBook(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Only allow the user who added the book or admins to delete it
      if (book.addedBy && book.addedBy !== req.user?.id) {
        return res.status(403).json({ message: "Not authorized to delete this book" });
      }
      
      const deleted = await storage.deleteBook(id);
      
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ message: "Failed to delete book" });
    }
  });

  

  // Review routes
  
  app.post("/api/books/:bookId/reviews", isAuthenticated, async (req, res) => {
    try {
      const bookId = parseInt(req.params.bookId, 10);
      const book = await storage.getBook(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      const reviewData = reviewSchema.parse({
        ...req.body,
        bookId,
        userId: req.user?.id
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const review = await storage.getReview(id);
      
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(review);
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ message: "Failed to fetch review" });
    }
  });



  
  app.get("/api/users/:userId/reviews", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const reviews = await storage.getReviewsByUserId(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
