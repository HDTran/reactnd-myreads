import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Bookshelf extends Component {
	static propTypes = {
		shelfName: PropTypes.string.isRequired,
		books: PropTypes.array.isRequired,
		onMoveBook: PropTypes.func.isRequired
	}

	render() {
		return (
			<div className="bookshelf">
				<h2 className="bookshelf-title">{this.props.shelfName}</h2>
				<div className="bookshelf-books">
				<ol className="books-grid">
					{this.props.books.map(book => (
						<li key={book.id}>
						<div className="book">
							<div className="book-top">
							<div className="book-cover" style={book.imageLinks ? { width: 128, height: 193, backgroundImage: `url("${book.imageLinks.thumbnail}")` } : { width: 128, height: 193, backgroundColor: '#CCC' }}></div>
							<div className="book-shelf-changer">
								<select defaultValue={book.shelf ? book.shelf : 'none'} onChange={(e) => { this.props.onMoveBook(book, e.target.value); }}>
									<option disabled>Move to...</option>
									<option value="currentlyReading" disabled={book.shelf === 'currentlyReading'}>Currently Reading</option>
									<option value="wantToRead" disabled={book.shelf === 'wantToRead'}>Want to Read</option>
									<option value="read" disabled={book.shelf === 'read'}>Read</option>
									<option value="none" disabled={book.shelf === 'none'}>None</option>
								</select>
							</div>
							</div>
							<div className="book-title">{book.title}</div>
							<div className="book-authors">{book.authors ? book.authors.map((author, index) => (index === 0 ? author:`, ${author}`)) : 'Anonymous'}</div>
						</div>
						</li>
					))}
				</ol>
				</div>
			</div>
		);
	}
}

export default Bookshelf;