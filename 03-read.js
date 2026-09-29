db = db.getSiblingDB("libraryMgmtDB");

printjson(db.books.find().toArray());                                   // all
printjson(db.books.findOne({ isbn: "978-0132350884" }));                // one
printjson(db.books.find({ category: "Programming" }).toArray());        // filter
printjson(db.books.find({ availableCopies: { $gt: 0 } }).toArray());    // in stock
printjson(db.books.find({ title: /clean/i }).toArray());                // search: using regular expression where i means case insensitive
printjson(db.books.find({}, { title: 1, author: 1, _id: 0 }).toArray()); // projection
printjson(db.books.find().sort({ title: 1 }).limit(2).toArray());       // sort + limit
print("Programming books: " + db.books.countDocuments({ category: "Programming" }));