# Book Review Website

## Table of contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [APIs](#apis)
  - [Deployment](#deployment)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview
This website is a personal book showcase where I display books I've read, share my reviews and ratings, and manage my reading list. Visitors can browse through the collection, read my thoughts on each book, and even add, edit, or delete book entries.

### Screenshot
![Screenshot](images/desktop-preview.png)

### Links
- Solution URL: https://goodbooks-c5le.onrender.com/
- Live URL: https://github.com/lulublake/goodbooks.git

## Technologies Used

### Frontend
- **Embedded Javascript (EJS)**: For structuring the web content, client-side interactivity and generating HTML markup with plain JavaScript.
- **CSS**: For styling the website, including responsive design.

### Backend
- **Node.js**: The runtime environment for the server.
- **Express.js**: Web application framework for Node.js, used to build the server-side of the application.

### Database
- **PostgreSQL**: An open-source object-relational database system used to store book information, reviews, and user data.
- **Node-Postgres (pg)**: Non-blocking PostgreSQL client for Node.js, used to interact with the PostgreSQL database from the Node.js application.

### APIs
- **Open Library API**: Used to fetch book cover images and additional book metadata.

### Deployment
- **Render**: Cloud application hosting service used for deploying and hosting the application. Render provides easy deployment from Git repositories and supports PostgreSQL databases.

## Features
- Display of book collection with cover images, titles, and authors.
- Sort books based on recency, title, and rating.
- Search for specific books using the search bar.
- Responsive design that works on both desktop and mobile devices.
- Integration with Open Library API for book cover images.

## Setup and Installation
1. Create a database on pgAdmin and run the following lines of code:
```sql
CREATE TABLE read_books(
  id SERIAL PRIMARY KEY,
  isbn BIGINT UNIQUE NOT NULL,
  cover_url TEXT,
  title TEXT,
  author TEXT,
  review TEXT NOT NULL,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rating FLOAT NOT NULL
);
```
2. Clone the repository:
```bash
git clone https://github.com/lulublake/goodbooks.git
```
3. Install the dependencies:
```bash
npm install
```
4. Create a .env file in the root of the project and add the code:
```bash
DATABASE_URL="postgres://your_local_db_username:your_password@localhost:5432/name_of_database"
```
5. Run the application:
```bash
node --watch index.js
```
6. Usage:
Visit http://localhost:3000 in your browser to view the website.

## Useful Resources
- [Derek Sivers Book Notes](https://sive.rs/book) — Used for layout inspiration.
- [Digital Bookshelf by Dimitris Papazafeiris](https://github.com/DimitrisPapazafeiris/Digital-Bookself) — Helpful reference when working with the Open Library API.
- [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) — Used for fetching book cover images.

## Author
- [X (Twitter)](https://x.com/__babylu)
- [Instagram](https://www.instagram.com/_baby.lu__)

## Acknowledgements
I would like to thank Dr. Angela Yu, the instructor to my fullstack course at Udemy and for giving me such a nice capstone project to showcase my skills on my Portfolio.