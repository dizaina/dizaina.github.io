import { users, books, reviews } from "@shared/schema";
import type { User, Book, Review, InsertUser, InsertBook, InsertReview } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const MemoryStore = createMemoryStore(session);

// Paths for JSON file storage
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const BOOKS_FILE = path.join(DATA_DIR, "books.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
}

// Generic function to read JSON data
async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    return [];
  }
}

// Generic function to write JSON data
async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Book methods
  getAllBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  getBooksByTitle(title: string): Promise<Book[]>;
  getBooksByAuthor(author: string): Promise<Book[]>;
  getBookByISBN(isbn: string): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  
  // Review methods
  getReviewsByBookId(bookId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;

  // Session store
  sessionStore: session.SessionStore;
}

export class FileStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
    
    // Initialize the data directory
    ensureDataDir();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = await readJsonFile<User>(USERS_FILE);
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await readJsonFile<User>(USERS_FILE);
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await readJsonFile<User>(USERS_FILE);
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newUser: User = {
      ...insertUser,
      id,
    };
    
    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);
    
    return newUser;
  }

  // Book methods
  async getAllBooks(): Promise<Book[]> {
    return await readJsonFile<Book>(BOOKS_FILE);
  }

  
async searchBooks(query: string): Promise<Book[]> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    const lowerCaseQuery = query.toLowerCase();
  
    return books.filter(book =>
      book.title.toLowerCase().includes(lowerCaseQuery) ||
      book.author.toLowerCase().includes(lowerCaseQuery) ||
      book.description && book.description.toLowerCase().includes(lowerCaseQuery)
    );
  }
  

  async getBook(id: number): Promise<Book | undefined> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    return books.find(book => book.id === id);
  }

  async getBooksByTitle(title: string): Promise<Book[]> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    return books.filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  async getBooksByAuthor(author: string): Promise<Book[]> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    return books.filter(book => 
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  async getBookByISBN(isbn: string): Promise<Book | undefined> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    return books.find(book => book.isbn === isbn);
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    const id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    
    const newBook: Book = {
      ...insertBook,
      id,
      createdAt: new Date(),
    };
    
    books.push(newBook);
    await writeJsonFile(BOOKS_FILE, books);
    
    return newBook;
  }

  async updateBook(id: number, bookUpdate: Partial<InsertBook>): Promise<Book | undefined> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    const index = books.findIndex(book => book.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const updatedBook = {
      ...books[index],
      ...bookUpdate,
    };
    
    books[index] = updatedBook;
    await writeJsonFile(BOOKS_FILE, books);
    
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    const books = await readJsonFile<Book>(BOOKS_FILE);
    const filteredBooks = books.filter(book => book.id !== id);
    
    if (filteredBooks.length === books.length) {
      return false; // No book was removed
    }
    
    await writeJsonFile(BOOKS_FILE, filteredBooks);
    
    // Also delete all reviews for this book
    const reviews = await readJsonFile<Review>(REVIEWS_FILE);
    const filteredReviews = reviews.filter(review => review.bookId !== id);
    await writeJsonFile(REVIEWS_FILE, filteredReviews);
    
    return true;
  }

  // Review methods
  async getReviewsByBookId(bookId: number): Promise<Review[]> {
    const reviews = await readJsonFile<Review>(REVIEWS_FILE);
    return reviews.filter(review => review.bookId === bookId);
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    const reviews = await readJsonFile<Review>(REVIEWS_FILE);
    return reviews.filter(review => review.userId === userId);
  }

  async getReview(id: number): Promise<Review | undefined> {
    const reviews = await readJsonFile<Review>(REVIEWS_FILE);
    return reviews.find(review => review.id === id);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const reviews = await readJsonFile<Review>(REVIEWS_FILE);
    const id = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    
    const newReview: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    
    reviews.push(newReview);
    await writeJsonFile(REVIEWS_FILE, reviews);
    
    return newReview;
  }

  async updateReview(id: number, reviewUpdate: Partial<InsertReview>): Promise<Review | undefined> {
    const reviews = await readJsonFile<Review>(REVIEWS_FILE);
    const index = reviews.findIndex(review => review.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const updatedReview = {
      ...reviews[index],
      ...reviewUpdate,
    };
    
    reviews[index] = updatedReview;
    await writeJsonFile(REVIEWS_FILE, reviews);
    
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    const reviews = await readJsonFile<Review>(REVIEWS_FILE);
    const filteredReviews = reviews.filter(review => review.id !== id);
    
    if (filteredReviews.length === reviews.length) {
      return false; // No review was removed
    }
    
    await writeJsonFile(REVIEWS_FILE, filteredReviews);
    return true;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private reviews: Map<number, Review>;
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentBookId: number;
  currentReviewId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.reviews = new Map();
    this.currentUserId = 1;
    this.currentBookId = 1;
    this.currentReviewId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Book methods
  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async getBooksByTitle(title: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  async getBooksByAuthor(author: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => 
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  async getBookByISBN(isbn: string): Promise<Book | undefined> {
    return Array.from(this.books.values()).find(book => 
      book.isbn === isbn
    );
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.currentBookId++;
    const book: Book = { 
      ...insertBook, 
      id, 
      createdAt: new Date() 
    };
    this.books.set(id, book);
    return book;
  }

  async updateBook(id: number, bookUpdate: Partial<InsertBook>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;

    const updatedBook = { ...book, ...bookUpdate };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    const deleted = this.books.delete(id);
    
    // Also delete all reviews for this book
    if (deleted) {
      for (const [reviewId, review] of this.reviews.entries()) {
        if (review.bookId === id) {
          this.reviews.delete(reviewId);
        }
      }
    }
    
    return deleted;
  }

  // Review methods
  async getReviewsByBookId(bookId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => 
      review.bookId === bookId
    );
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => 
      review.userId === userId
    );
  }

  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: number, reviewUpdate: Partial<InsertReview>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;

    const updatedReview = { ...review, ...reviewUpdate };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }
}

// Use FileStorage for JSON file-based persistence
export const storage = new FileStorage();
