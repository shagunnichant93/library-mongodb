# Library Management System (MongoDB)

A beginner-friendly mini project that models a library using **only MongoDB** (`mongosh`). It manages **books**, **users**, and **transactions** (issuing and returning), with proper relationships, all CRUD operations, tracking queries, and an ACID transaction example.

## Tech

- MongoDB (local)
- `mongosh` (MongoDB Shell)
- Git and GitHub

## Database Design

```
users (1) ────< transactions >──── (1) books
```

`transactions` stores `userId` and `bookId`, which link the other two collections (like foreign keys in SQL). Data is joined with `$lookup`.

### `users`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `name` | string | Required |
| `email` | string | Required, unique |
| `role` | string | `member` or `admin` |
| `createdAt` | date | |

### `books`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `title` | string | Required |
| `author` | string | Required |
| `isbn` | string | Required, unique |
| `category` | string | |
| `totalCopies` | int | Required, minimum 0 |
| `availableCopies` | int | Required, minimum 0 |

### `transactions`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `userId` | ObjectId | References `users._id` |
| `bookId` | ObjectId | References `books._id` |
| `issueDate` | date | |
| `dueDate` | date | 14 days after issue |
| `returnDate` | date / null | Set on return |
| `status` | string | `issued` or `returned` |
| `fine` | number | Rs 5 per late day |

## Project Structure

```
library-mongodb/
├── 01-setup.js              # collections, validation, indexes
├── 02-create.js             # insert users and books
├── 03-read.js               # find, filter, search, sort
├── 04-update.js             # update, $inc, upsert
├── 05-delete.js             # delete, safe delete
├── 06-issue-book.js         # issue a book
├── 07-return-book.js        # return a book, calculate fine
├── 08-tracking.js           # $lookup joins and reports
├── 09-acid-transaction.js   # multi-step transaction (replica set / Atlas)
└── README.md
```

## Getting Started

1. Install MongoDB and `mongosh`, and make sure the MongoDB server is running.
2. Clone the repo:
   ```bash
   git clone https://github.com/shagunnichant93/library-mongodb.git
   cd library-mongodb
   ```
3. Run the scripts in order:

   | Step    | Command |
   |------|------|
   | 1. Setup | `mongosh --file 01-setup.js` |
   | 2. Create | `mongosh --file 02-create.js` |
   | 3. Read | `mongosh --file 03-read.js` |
   | 4. Update | `mongosh --file 04-update.js` |
   | 5. Delete | `mongosh --file 05-delete.js` |
   | 6. Issue | `mongosh --file 06-issue-book.js` |
   | 7. Return | `mongosh --file 07-return-book.js` |
   | 8. Track | `mongosh --file 08-tracking.js` |
   | 9. ACID (bonus) | `mongosh --file 09-acid-transaction.js` |

   If you use Atlas, add your connection string: `mongosh "mongodb+srv://..." --file 01-setup.js`.

4. Run `02-create.js` only once, because email and ISBN are unique and a second run will fail.

## Features

### CRUD

- **Create:** `insertMany` for users and books
- **Read:** `find`, `findOne`, filters, `$gt`, regex search, projection, `sort`, `limit`, `countDocuments`
- **Update:** `updateOne`, `updateMany`, `$set`, `$inc`, upsert
- **Delete:** `deleteOne`, `deleteMany`, safe delete (blocks users with issued books)

### Library operations

- **Issue:** checks the user does not already hold the book, reduces stock only if a copy is available (atomic update), then creates the transaction
- **Return:** marks the transaction returned, restores stock, calculates the fine using `$dateDiff`
- **Track:** currently issued books, overdue books, user history, most issued books, total fines, out-of-stock books

### Data safety

- `$jsonSchema` validation on all three collections
- Unique indexes on `users.email` and `books.isbn`
- Indexes on `transactions` for faster lookups
- Atomic stock update: `availableCopies: { $gt: 0 }` prevents two users taking the last copy
- ACID transaction example (needs a replica set or Atlas; a plain local server will show an error)

## Sample Query

Books currently issued, with user and book details:

```js
db.transactions.aggregate([
  { $match: { status: "issued" } },
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
  { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
  { $unwind: "$user" },
  { $unwind: "$book" },
  { $project: { _id: 0, user: "$user.name", book: "$book.title", dueDate: 1 } }
])
```

## Concepts Covered

- Referencing vs embedding
- `$lookup` (MongoDB's version of JOIN)
- Aggregation pipeline: `$match`, `$group`, `$project`, `$sort`, `$unwind`
- Atomic operations
- Unique indexes and schema validation
- ACID transactions in MongoDB

## Author

Shagun Nichant, [GitHub profile](https://github.com/shagunnichant93/)