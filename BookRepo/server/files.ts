import path from 'path';
import fs from 'fs/promises';
import { Book, Review } from '@shared/schema';

// Initialize database with sample data if needed
export async function initializeData() {
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if users.json exists, if not create it
    try {
      await fs.access(path.join(dataDir, 'users.json'));
    } catch (error) {
      await fs.writeFile(
        path.join(dataDir, 'users.json'),
        JSON.stringify([], null, 2)
      );
    }
    
    // Check if books.json exists, if not create it with sample data
    let needsSampleData = false;
    try {
      await fs.access(path.join(dataDir, 'books.json'));
      const booksData = await fs.readFile(path.join(dataDir, 'books.json'), 'utf-8');
      const books = JSON.parse(booksData);
      if (books.length === 0) {
        needsSampleData = true;
      }
    } catch (error) {
      needsSampleData = true;
    }
    
    if (needsSampleData) {
      const sampleBooks: Book[] = [
        {
          id: 1,
          title: "Clean Code: A Handbook of Agile Software Craftsmanship",
          author: "Robert C. Martin",
          isbn: "978-0132350884",
          description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
          publicationYear: 2008,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: "Design Patterns: Elements of Reusable Object-Oriented Software",
          author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
          isbn: "978-0201633610",
          description: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
          publicationYear: 1994,
          createdAt: new Date(),
        },
        {
          id: 3,
          title: "The Pragmatic Programmer: Your Journey to Mastery",
          author: "David Thomas, Andrew Hunt",
          isbn: "978-0201616224",
          description: "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process.",
          publicationYear: 2019,
          createdAt: new Date(),
        },
        {
          id: 4,
          title: "Refactoring: Improving the Design of Existing Code",
          author: "Martin Fowler",
          isbn: "978-0134757599",
          description: "Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code, yet improves its internal structure.",
          publicationYear: 2018,
          createdAt: new Date(),
        },
        {
          id: 5,
          title: "You Don't Know JS: Up & Going",
          author: "Kyle Simpson",
          isbn: "978-1491924464",
          description: "It's easy to learn parts of JavaScript, but much harder to learn it completely—or even sufficiently—whether you're new to the language or have used it for years.",
          publicationYear: 2015,
          createdAt: new Date(),
        },
        {
          id: 6,
          title: "Eloquent JavaScript: A Modern Introduction to Programming",
          author: "Marijn Haverbeke",
          isbn: "978-1593279509",
          description: "JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon.",
          publicationYear: 2018,
          createdAt: new Date(),
        }
      ];
      
      await fs.writeFile(
        path.join(dataDir, 'books.json'),
        JSON.stringify(sampleBooks, null, 2)
      );
    }
    
    // Check if reviews.json exists, if not create it with sample data
    try {
      await fs.access(path.join(dataDir, 'reviews.json'));
      const reviewsData = await fs.readFile(path.join(dataDir, 'reviews.json'), 'utf-8');
      const reviews = JSON.parse(reviewsData);
      if (reviews.length === 0 && needsSampleData) {
        // Add sample reviews only if we added sample books
        const sampleReviews: Review[] = [
          {
            id: 1,
            bookId: 1,
            userId: 0, // Will show as 'Anonymous' in the UI
            rating: 5,
            title: "Essential reading for developers",
            content: "This book changed how I approach code reviews and my own programming habits. The principles are timeless despite being published over a decade ago.",
            createdAt: new Date(),
          },
          {
            id: 2,
            bookId: 1,
            userId: 0,
            rating: 4,
            title: "Good but some examples are dated",
            content: "Great principles that still apply today, but some code examples feel outdated. Would love to see an updated version with modern languages and practices.",
            createdAt: new Date(),
          },
          {
            id: 3,
            bookId: 2,
            userId: 0,
            rating: 4,
            title: "Classic but complex for beginners",
            content: "While this is undoubtedly a foundational text in software engineering, I found some sections quite dense and theoretical. The examples, while thorough, use older programming paradigms that might confuse those working primarily with modern languages and frameworks.",
            createdAt: new Date(),
          }
        ];
        
        await fs.writeFile(
          path.join(dataDir, 'reviews.json'),
          JSON.stringify(sampleReviews, null, 2)
        );
      }
    } catch (error) {
      await fs.writeFile(
        path.join(dataDir, 'reviews.json'),
        JSON.stringify([], null, 2)
      );
    }
    
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}
