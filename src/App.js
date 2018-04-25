import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { Route, Link } from 'react-router-dom';
import Bookshelf from './Bookshelf';

class BooksApp extends Component {
  state = {
    books: [],
    searchBooks: [],
    query: ''
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState(() => ({ books }));
    });
  }

  moveBook = (book, shelf) => {
    if(book.shelf !== shelf) {
      this.setState((currentState) => {
        let index = currentState.books.findIndex((element) => (element.id === book.id));
        if(index > -1) {
          book = currentState.books[index]; 
          currentState.books.splice(index, 1);
        }

        let searchIndex = currentState.searchBooks.findIndex((element) => (element.id === book.id));
        if(searchIndex > -1) {
          currentState.searchBooks[searchIndex].shelf = shelf;
        }

        book.shelf = shelf;
        return {
          books: currentState.books.concat(book),
          searchBooks: currentState.searchBooks
        };
      });

      BooksAPI.update(book, shelf);
    }
  }

  handleSearchChange = (query) => {
    let searchQuery = query.trim();
    this.setState(() => ({ query }));

    if(searchQuery === '') {
      this.setState(() => ({ searchBooks: [] }));
    }
    else {
      BooksAPI.search(searchQuery).then((books) => {
        if(!books.error) {
          books = books.map((book) => {
            let index = this.state.books.findIndex((element) => (element.id === book.id));
            if(index > -1) {
              book.shelf = this.state.books[index].shelf;
            }
            return book;
          });
          this.setState(() => ({ searchBooks: books }));
        }
        else {
          this.setState(() => ({ searchBooks: [] }));
        }
      });
    }
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={(event) => { this.handleSearchChange(event.target.value); }} />
              </div>
            </div>
            <div className="search-books-results">
              <Bookshelf shelfName="Search Results" books={this.state.searchBooks} onMoveBook={this.moveBook} />
            </div>
          </div>
        )} />
        <Route path="/" exact render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <Bookshelf shelfName="Currently Reading" books={this.state.books.filter(book => book.shelf === 'currentlyReading')} onMoveBook={this.moveBook} />
                <Bookshelf shelfName="Want to Read" books={this.state.books.filter(book => book.shelf === 'wantToRead')} onMoveBook={this.moveBook} />
                <Bookshelf shelfName="Read" books={this.state.books.filter(book => book.shelf === 'read')} onMoveBook={this.moveBook} />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
