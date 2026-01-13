const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { // isValid = vérifie si l'utilisateur existe déjà
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User successfully registered" });
        } else {
            return res.status(404).json({ message: "User already exists" });
        }
    }
    return res.status(404).json({ message: "Username or password not provided" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Simule un appel asynchrone, même si les livres sont locaux
        const response = await new Promise((resolve, reject) => {
            resolve(books); // ici books est ton objet local
        });

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });
        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const results = await new Promise((resolve, reject) => {
            let filteredBooks = [];
            for (let isbn in books) {
                if (books[isbn].author === author) {
                    filteredBooks.push(books[isbn]);
                }
            }
            if (filteredBooks.length > 0) resolve(filteredBooks);
            else reject("No books found for this author");
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const results = await new Promise((resolve, reject) => {
            let filteredBooks = [];
            for (let isbn in books) {
                if (books[isbn].title === title) {
                    filteredBooks.push(books[isbn]);
                }
            }
            if (filteredBooks.length > 0) resolve(filteredBooks);
            else reject("No books found with this title");
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
