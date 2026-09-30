db = db.getSiblingDB("libraryMgmtDB");

const user = db.users.findOne({ email: "asha@example.com" });
const book = db.books.findOne({ isbn: "978-0132350884" });

const already = db.transactions.findOne({ userId: user._id, bookId: book._id, status: "issued" });

if (already) {
  print("User already has this book");
} else {
  // Reduce stock only if a copy exists (atomic, so it is safe)
  const r = db.books.updateOne(
    { _id: book._id, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } });

  if (r.modifiedCount === 1) {
    db.transactions.insertOne({
      userId: user._id, bookId: book._id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),  // 14 days
      returnDate: null, status: "issued", fine: 0 });
    print("Book issued");
  } else { print("No copies available"); }
}