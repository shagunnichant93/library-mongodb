db = db.getSiblingDB("libraryMgmtDB");

// Delete the book we updated in Step 4
db.books.deleteOne({ isbn: "978-1491950296" });

// Safe delete: remove a user only if they have no issued books
db.users.insertOne({ name: "Temp User", email: "temp@example.com", role: "member" });
const u = db.users.findOne({ email: "temp@example.com" });
const pending = db.transactions.countDocuments({ userId: u._id, status: "issued" });
if (pending === 0) { db.users.deleteOne({ _id: u._id }); print("User deleted"); }
else { print("Cannot delete: user still has issued books"); }

// Delete many (old returned records)
db.transactions.deleteMany({ status: "returned", returnDate: { $lt: new Date("2020-01-01") } });