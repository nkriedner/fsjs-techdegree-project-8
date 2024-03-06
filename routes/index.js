var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    };
}

/* GET / route -> redirect to /books */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const books = await Book.findAll();
        // console.log(res.json(books));
        // res.send("Welcome");
        // res.render("index", { title: "test" });
        res.redirect("/books");
    })
);

/* GET /books route -> show the full list of books */
router.get(
    "/books",
    asyncHandler(async (req, res) => {
        const books = await Book.findAll();
        // console.log(res.json(books));
        // res.send("Welcome");
        // res.render("index", { books, title: "Library Application" });
        res.render("index", { books, title: "Books" });
    })
);

/* GET /books/new route -> show the create new book form */
router.get(
    "/books/new",
    asyncHandler(async (req, res) => {
        const books = await Book.findAll();
        // console.log(res.json(books));
        // res.send("Welcome");
        res.render("new-book", { title: "Shows the create new book form" });
    })
);

/* POST /books/new route -> post a new book to the database */
router.post(
    "/books/new",
    asyncHandler(async (req, res) => {
        const books = await Book.findAll();
        // console.log(res.json(books));
        // res.send("Welcome");
        res.render("new-book", { title: "Posts a new book to the database" });
    })
);

/* GET /books/:id route -> show book detail form */
router.get(
    "/books/:id",
    asyncHandler(async (req, res) => {
        const books = await Book.findAll();
        // console.log(res.json(books));
        // res.send("Welcome");
        res.render("update-book", { title: "Shows book detail form" });
    })
);

/* POST /books/:id route -> update book info in database */
router.post(
    "/books/:id",
    asyncHandler(async (req, res) => {
        const books = await Book.findAll();
        // console.log(res.json(books));
        // res.send("Welcome");
        res.render("update-book", { title: "Updates book info in the database" });
    })
);

/* POST /books/:id route -> delete a book */
router.post(
    "/books/:id/delete",
    asyncHandler(async (req, res) => {
        const books = await Book.findAll();
        // console.log(res.json(books));
        // res.send("Welcome");
        res.render("index", { title: "Deletes a book" });
    })
);

module.exports = router;
