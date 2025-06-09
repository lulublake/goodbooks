import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// const db = new pg.Client({
//     user: 'pg_admin_username',
//     password: 'pg_admin_password',
//     database: 'name_of_db',
//     host: 'localhost',
//     port: 5432
// });
// db.connect();

const isRender = process.env.DATABASE_URL?.includes("render.com");

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isRender ? { rejectUnauthorized: false } : false,
});
db.connect();  

async function allBooks(){
    const result = await db.query('SELECT * FROM read_books ORDER BY id DESC');
    const books = [];
    result.rows.forEach((book) => {
        books.push(book);
    });
    return books;
}

app.get('/', async (req, res) =>{
    const books = await allBooks();
    res.render("index.ejs", { books: books });
});

app.get('/sort-option', async(req, res) => {
    const selectedOption = req.query.options;
    const books = [];

    let query = "SELECT * FROM read_books";

    if (selectedOption === "rating") {
      query += " ORDER BY rating DESC";
    } else if (selectedOption === "date") {
      query += " ORDER BY date_added DESC";
    } else if (selectedOption === "title") {
      query += " ORDER BY title ASC";
    }

    const result = await db.query(query);
    result.rows.forEach((book) => {
        books.push(book);
    });

    res.render("index.ejs", { 
        books: books,
        selected: selectedOption 
    });
});

app.post('/search', async(req, res) => {
    const bookName = req.body.search.trim();
    const newBooks = [];
    try {
        const result = await db.query(
            'SELECT * FROM read_books WHERE title ILIKE $1',
            [`%${bookName}%`]
        );
        if(result.rows.length === 0){
          const books = await allBooks();
          return res.render('index.ejs', {
            books: books,
            error: "No book found"
          });
        }
        result.rows.forEach((book) => {
            newBooks.push(book);
        });
        res.render('index.ejs', {
            books: newBooks
        });
    } catch (error) {
        console.log(error);
    }
     
});

app.post('/add', async(req, res) => {
    res.render("newbook.ejs");
});

app.post('/edit', async(req, res) => {
    const bookId = req.body.bookID;
    const result = await db.query('SELECT * FROM read_books WHERE id = $1', [bookId]);
    const book = result.rows[0];
    res.render("oldbook.ejs", { book: book });
});

app.post('/new', async(req, res) => {
    const isbn = req.body.isbn;
    const review = req.body.review;
    const rating = parseFloat(req.body.rating);

    try {
        const apiRequest = await axios.get(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
        );
        const bookData = apiRequest.data[`ISBN:${isbn}`];
        const title = bookData.title;
        const author = bookData.authors[0].name;
        const cover_url = bookData.cover.medium;

        const alreadyExists = await db.query(
            'SELECT * FROM read_books WHERE isbn = $1',
            [isbn]
        );

        if(alreadyExists.rows.length > 0){
            return res.render('newbook.ejs', {
                isbn_error: 'You already have this book'
            });
        }

        if(!review){
            return res.render('newbook.ejs', { error: 'This field is required' });
        }

        if(!rating || rating < 1 || rating > 10){
            return res.render('newbook.ejs', { rating_error: 'Rating must be between 1 and 10'});
        }

        try {
            await db.query(
                'INSERT INTO read_books(isbn, cover_url, title, author, review, rating) VALUES ($1, $2, $3, $4, $5, $6)',
                [isbn, cover_url, title, author, review, rating]
            );
            res.redirect('/');
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to add book.');
        }
         
    } catch (isbn_error) {
        res.render('newbook.ejs', {
            isbn_error: 'Book not found'
        });
    }
});

app.post('/update', async(req, res) => {
    const bookId = req.body.bookID;
    const review = req.body.review;
    const rating = parseFloat(req.body.rating);

    try {
        const result = await db.query('SELECT * FROM read_books WHERE id = $1', [bookId]);
        const bookDetails = result.rows[0];

        if(!review){
            review = bookDetails.review;
        }
        if(!rating){
            rating = bookDetails.rating;
        }

        await db.query(
            'UPDATE read_books SET review = $1, rating = $2 WHERE id = $3',
            [review, rating, bookId]
        );
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to update book.');
    }
});

app.post('/delete', async(req, res) => {
    const bookId = req.body.bookID;
    try {
        await db.query(
            'DELETE FROM read_books WHERE id = $1',
            [bookId]
        );
        res.redirect('/');
    } catch (error) {
       console.log(error); 
    }
});

app.listen(port, () =>{
    console.log(`Started listening at port ${port}`);
});

