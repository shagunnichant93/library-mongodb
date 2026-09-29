db = db.getSiblingDB("libraryMgmtDB");

db.users.insertMany([
  { name: "Asha Verma",  email: "asha@example.com",  role: "member", createdAt: new Date() },
  { name: "Rohan Gupta", email: "rohan@example.com", role: "member", createdAt: new Date() },
  { name: "Admin Neha",  email: "neha@example.com",  role: "admin",  createdAt: new Date() }
]);

db.books.insertMany([
  { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884",
    category: "Programming", totalCopies: NumberInt(3), availableCopies: NumberInt(3) },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "978-0135957059",
    category: "Programming", totalCopies: NumberInt(2), availableCopies: NumberInt(2) },
  { title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292",
    category: "Self-help", totalCopies: NumberInt(1), availableCopies: NumberInt(1) }
]);