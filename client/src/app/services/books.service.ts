import { Injectable, signal } from '@angular/core';
//import books model
import { Books } from '../models/books';
//import httpClient to request data from json server
import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private httpClient: HttpClient) {}

  //base url for accessing the books array on json server
  private url = 'http://localhost:4000/books-api';

  //signal to change when user clicks on browse books or readingList
  headerSearch = signal('');

  //function to add a new book in the books array on json server
  addBook(book: any) {
    //this function return observable so we need to subscribe to this observable in the component to execute this request
    return this.httpClient.post<Books | any>(this.url + '/add-new-book', book);
  }

  //function to delete the book when the user clicks deleteBook button
  deleteBook(id: string) {
    const deleteUrl = `http://localhost:4000/books-api/delete-book/${id}`;
    return this.httpClient.delete<any>(deleteUrl);
  }

  // taking signals to store Book id when click on updateBook button in books component
  bookId = signal('');

  // function so that the user can update Book details and initialize values that are seen by default at the edit component
  showBook(id: string) {
    let url = `http://localhost:4000/books-api/show-book/${id}`;
    return this.httpClient.get<any>(url);
  }

  //function to update the bookDetails in the jsonServer
  updateBook(user: any) {
    let url = 'http://localhost:4000/books-api/update-book';
    return this.httpClient.put<any>(url, user);
  }
}
