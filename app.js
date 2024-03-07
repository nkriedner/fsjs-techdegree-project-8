var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// Import the instance.... (step 5)
const { sequelize } = require("./models");

// asyn IIFE
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to database.");
        sequelize.sync();
    } catch (err) {
        console.error("Error when trying to connect to database:", err);
    }
})();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    if (err.status === 404) {
        err.message = "Sorry, but we could not find a page for this url.";
        // res.status(404).send(err.message);
        res.status(404).render("page-not-found", { err });
        console.log(err.status, err.message);
    } else {
        err.message = "Sorry, but something went wrong...";
        res.status(err.status || 500).send(err.message);
        // res.render("error");
        console.log(err.status, err.message);
    }
});

module.exports = app;
