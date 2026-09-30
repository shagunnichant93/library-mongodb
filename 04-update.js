db = db.getSiblingDB("libraryMgmtDB");

// Change a field
db.users.updateOne({ email: "asha@example.com" }, { $set: { name: "Asha V. Sharma" } });

// Add stock
db.books.updateOne({ isbn: "978-0735211292" },
  { $inc: { totalCopies: 1, availableCopies: 1 } });

// Update many
db.books.updateMany({ category: "Programming" }, { $set: { shelf: "A1" } });

// Upsert: update if found, otherwise insert
db.books.updateOne({ isbn: "978-1491950296" },
  { $setOnInsert: { title: "Building Microservices", author: "Sam Newman",
      totalCopies: NumberInt(1), availableCopies: NumberInt(1) } },
  { upsert: true });