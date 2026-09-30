db = db.getSiblingDB("libraryMgmtDB");

//issue a book, then set an old due date with
//db.transactions.updateOne({status:"issued"}, {$set:{dueDate:new Date("2026-09-01")}})

const user = db.users.findOne({ email: "asha@example.com" });
const book = db.books.findOne({ isbn: "978-0132350884" });
const tx = db.transactions.findOne({ userId: user._id, bookId: book._id, status: "issued" });

if (!tx) {
  print("No active issue found");
} else {
  db.transactions.updateOne({ _id: tx._id }, [
    { $set: {
        returnDate: "$$NOW",
        status: "returned",
        fine: { $multiply: [
          { $max: [0, { $dateDiff: { startDate: "$dueDate", endDate: "$$NOW", unit: "day" } }] },
          5 ] } } } ]);                       // Rs 5 per late day

  db.books.updateOne({ _id: tx.bookId }, { $inc: { availableCopies: 1 } });
  print("Book returned");
}

