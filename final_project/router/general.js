const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(404).json({ message: "Bad request" });

  if (isValid(username))
    return res.status(403).json({ message: "Account already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "Account created successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 2000);
  });
  myPromise.then((data) => {
    return res.status(200).json(data);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const { isbn } = req.params;

      if (!isbn) reject({ message: "Bad request" });

      if (!books[isbn]) reject({ message: "Book not found" });

      resolve(books[isbn]);
    }, 2000);
  });

  myPromise
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const { author } = req.params;

      if (!author) reject({ message: "Bad request" });

      const result = [];
      const authorLC = author.toLowerCase();

      for (let book of Object.values(books)) {
        if (book.author.toLowerCase().includes(authorLC)) result.push(book);
      }

      if (result.length === 0) reject({ message: "Book not found" });

      resolve(result);
    }, 2000);
  });

  myPromise
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const { title } = req.params;

      if (!title) reject({ message: "Bad request" });

      const result = [];
      const titleLC = title.toLowerCase();

      for (let book of Object.values(books)) {
        if (book.title.toLowerCase().includes(titleLC)) result.push(book);
      }

      if (result.length === 0) reject({ message: "Book not found" });

      resolve(result);
    }, 2000);
  });

  myPromise
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  if (!isbn) return res.status(404).json({ message: "Bad request" });

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
