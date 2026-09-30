const session = db.getMongo().startSession();
const lib = session.getDatabase("libraryMgmtDB");
session.startTransaction();
try {
  const user = lib.users.findOne({ email: "asha@example.com" });
  const book = lib.books.findOne({ isbn: "978-0135957059" });

  const r = lib.books.updateOne({ _id: book._id, availableCopies: { $gt: 0 } },
                                { $inc: { availableCopies: -1 } });
  if (r.modifiedCount === 0) throw new Error("No copies available");

  lib.transactions.insertOne({ userId: user._id, bookId: book._id,
    issueDate: new Date(), dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    returnDate: null, status: "issued", fine: 0 });

  session.commitTransaction();
  print("Issued safely");
} catch (e) {
  session.abortTransaction();
  print("Rolled back: " + e.message);
} finally { session.endSession(); }