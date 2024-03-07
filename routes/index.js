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

/* GET / route -> redirects to /books */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.redirect("/books");
    })
);

/* GET /books route -> shows the full list of books */
router.get(
    "/books",
    asyncHandler(async (req, res) => {
        // Retreive data for all books
        const books = await Book.findAll();
        // render table list of all books
        res.render("index", { books, title: "Book Overview" });
    })
);

/* GET /books/new route -> shows the "create new book" form */
router.get(
    "/books/new",
    asyncHandler(async (req, res) => {
        // render the new book form - add an empty book object because no data exists yet
        res.render("new-book", { book: {}, title: "Create New Book" });
    })
);

/* POST /books/new route -> posts a new book to the database */
router.post(
    "/books/new",
    asyncHandler(async (req, res) => {
        console.log("req.body:", req.body);

        let book;
        console.log("book:", book);

        try {
            // create new book with data from form (= req.body)
            book = await Book.create(req.body);
            console.log("book:", book);

            // redirect to start book overview
            res.redirect("/books");
        } catch (err) {
            // if it is a validation error -> show error message
            if (err.name === "SequelizeValidationError") {
                console.log("err.message:", err.message);

                console.log("book:", book);
                // res.render("index", { book: book, title: "New Book" });
                res.render("new-book", { book: req.body, errors: err.errors, title: "Create New Book" });
                // res.redirect("/books/new");
            } else {
                console.log(err);
            }
        }
        // create a new book:
        // -> ......
        // res.render("new-book", { title: "Posts a new book to the database" });
    })
);

/* POST /books/search route -> searches for books */
router.post(
    "/books/search",
    asyncHandler(async (req, res) => {
        // store query from search form
        const query = req.body.query.toLowerCase();
        // Retreive data for all books
        const books = await Book.findAll();
        // create variable to store search filtered books
        const filteredBooks = [];

        // loop through array of books
        for (let i = 0; i < books.length; i++) {
            // check if title, author, genre or year of book includes query
            if (
                books[i].title.toLowerCase().includes(query) ||
                books[i].author.toLowerCase().includes(query) ||
                books[i].genre.toLowerCase().includes(query) ||
                books[i].year.toString().includes(query)
            ) {
                console.log(books[i].title);
                // add book to filtered books array
                filteredBooks.push(books[i]);
            }
        }

        const searchPageTitle = `Results for: ${query}`;

        // res.json(filteredBooks);
        res.render("index", { books: filteredBooks, title: searchPageTitle });
    })
);

/* GET /books/:id route -> shows "book detail" form (update-book page) */
router.get(
    "/books/:id",
    asyncHandler(async (req, res) => {
        // use the id in the params to retreive the data for the book
        const book = await Book.findByPk(req.params.id);
        // render the book details in the update-book page
        res.render("update-book", { book, title: "Update Book" });
    })
);

/* POST /books/:id route -> updates book info in database */
router.post(
    "/books/:id",
    asyncHandler(async (req, res) => {
        console.log("req.body:", req.body);
        let book;
        try {
            // use id in params to find book
            book = await Book.findByPk(req.params.id);
            // update book with data from form (= req.body)
            await book.update(req.body);
            // redirect to main book page
            res.redirect("/books");
        } catch (err) {
            // if it is a validation error -> show error message
            if (err.name === "SequelizeValidationError") {
                book = req.body; // book data from the form
                book.id = req.params.id; // book id from the url params
                res.render("update-book", { book, errors: err.errors, title: "Update Book" });
            } else {
                console.log(err);
            }
        }
    })
);

/* POST /books/:id route -> deletes a book */
router.post(
    "/books/:id/delete",
    asyncHandler(async (req, res) => {
        // use the id in the params to find the book
        const book = await Book.findByPk(req.params.id);
        // delete book & redirect to main page
        await book.destroy();
        res.redirect("/books");
    })
);

module.exports = router;
