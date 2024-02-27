const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  for (let user of users) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
};

const authenticatedUser = (username, password) => {
  for (let user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(404).json({ message: "Bad request" });

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });

    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User logged in" });
  } else {
    return res
      .status(403)
      .json({ message: "Username and/or password is incorrect" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username, review } = req.body;

  if (!isbn || !username || !review)
    return res.status(404).json({ message: "Bad request" });

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.body;

  if (!isbn || !username)
    return res.status(404).json({ message: "Bad request" });

  if (books[isbn]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
