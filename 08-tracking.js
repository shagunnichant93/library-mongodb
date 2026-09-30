db = db.getSiblingDB("libraryMgmtDB");
const join = [
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
  { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
  { $unwind: "$user" }, { $unwind: "$book" }
];

print("--- Currently issued ---");
printjson(db.transactions.aggregate([
  { $match: { status: "issued" } }, ...join,
  { $project: { _id: 0, user: "$user.name", book: "$book.title", dueDate: 1 } }
]).toArray());

print("--- Overdue ---");
printjson(db.transactions.aggregate([
  { $match: { status: "issued", dueDate: { $lt: new Date() } } }, ...join,
  { $project: { _id: 0, user: "$user.name", email: "$user.email", book: "$book.title", dueDate: 1 } }
]).toArray());

print("--- History of one user ---");
const u = db.users.findOne({ email: "asha@example.com" });
printjson(db.transactions.aggregate([
  { $match: { userId: u._id } }, ...join,
  { $project: { _id: 0, book: "$book.title", issueDate: 1, returnDate: 1, status: 1, fine: 1 } },
  { $sort: { issueDate: -1 } }
]).toArray());

print("--- Most issued books ---");
printjson(db.transactions.aggregate([
  { $group: { _id: "$bookId", timesIssued: { $sum: 1 } } },
  { $sort: { timesIssued: -1 } }, { $limit: 3 },
  { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
  { $unwind: "$book" },
  { $project: { _id: 0, title: "$book.title", timesIssued: 1 } }
]).toArray());

print("--- Total fines ---");
printjson(db.transactions.aggregate([{ $group: { _id: null, totalFine: { $sum: "$fine" } } }]).toArray());

print("--- Out of stock ---");
printjson(db.books.find({ availableCopies: 0 }, { title: 1, _id: 0 }).toArray());