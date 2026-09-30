db = db.getSiblingDB("libraryMgmtDB");

db.createCollection("users", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "role"],
    properties: {
      name:  { bsonType: "string" },
      email: { bsonType: "string" },
      role:  { enum: ["member", "admin"] }
    }
  }}
});

db.createCollection("books", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["title", "author", "isbn", "totalCopies", "availableCopies"],
    properties: {
      title: { bsonType: "string" },
      author: { bsonType: "string" },
      isbn: { bsonType: "string" },
      totalCopies: { bsonType: "int", minimum: 0 },
      availableCopies: { bsonType: "int", minimum: 0 }
    }
  }}
});

db.createCollection("transactions", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["userId", "bookId", "issueDate", "dueDate", "status"],
    properties: {
      status: { enum: ["issued", "returned"] }
    }
  }}
});

// Indexes (unique = no duplicates, like UNIQUE in SQL)
db.users.createIndex({ email: 1 }, { unique: true });
db.books.createIndex({ isbn: 1 }, { unique: true });
db.transactions.createIndex({ userId: 1, status: 1 });
db.transactions.createIndex({ bookId: 1 });