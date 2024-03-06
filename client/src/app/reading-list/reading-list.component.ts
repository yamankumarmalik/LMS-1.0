import { Component, OnInit, inject, signal } from '@angular/core';
//bookService import
import { BooksService } from '../services/books.service';
//loginService import
import { LoginService } from '../services/login.service';
//httpClient import
import { HttpClient } from '@angular/common/http';
//books Model import
import { Books } from '../models/books';
// import router
import { Router } from '@angular/router';
//import ng-popup
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrl: './reading-list.component.css',
})
export class ReadingListComponent implements OnInit {
  //inject login service
  loginService = inject(LoginService);
  //inject book service
  bookService = inject(BooksService);
  //inject httpClient
  httpClient = inject(HttpClient);
  //inject router
  router = inject(Router);
  //ng-popup service
  toast = inject(NgToastService);

  constructor() {}
  //array to store books array returned from the json server
  book: any[] = []; //array where the data is stored from json server [[{book data}]]
  //array to store user ReadList
  readingList: any[] = [];
  //array to store the array data to be displayed
  displayList: any[] = [];
  //baseUrl for books array
  baseUrl: string = 'http://localhost:4000/books-api/all-books';
  //baseUrl for user reading list array
  userEmail = this.loginService.userEmailSignal;
  readingUrl: string = `http://localhost:4000/libUser-api/getUser/${this.userEmail()}`;
  //data to store if user list is empty
  isEmpty = false;

  //ngOnInit function initializes the values when the component is loaded
  ngOnInit(): void {
    //books to show when the user is logged in
    this.httpClient.get<any>(this.baseUrl).subscribe({
      next: (books) => {
        if (books.message === 'books') {
          for (let book of books.payload) {
            this.book.push(book);
          }
        } else {
          this.toast.error({
            detail: 'Some error occurred on the server!',
            summary: 'Please reload the page!',
            position: 'topCenter',
            sticky: true,
          });
        }
      },
      error: (err) => console.log(err),
    });
    //books to show when the user is logged in
    this.httpClient.get<any>(this.readingUrl).subscribe({
      next: (books) => {
        if (books.message === 'User Found') {
          for (let book of books.payload.readingList) {
            this.readingList.push(book);
          }

          //logic to search for book_id from reading list in books array and then push that book object inside display array
          for (let id of this.readingList) {
            for (let book of this.book) {
              if (book._id === id) {
                this.displayList.push(book);
              }
            }
          }
        } else {
          this.toast.error({
            detail: 'Some error occurred on the server!',
            summary: 'Please reload the page!',
            position: 'topCenter',
            sticky: true,
          });
        }

        //if readingList is empty set isEmpty to true
        if (books.payload.readingList.length === 0) {
          this.isEmpty = true;
        }
      },
      error: (err) => console.log(err),
    });
  }

  //function to be called when user click deleteBook button
  deleteBook(id: string) {
    const url = `http://localhost:4000/libUser-api/add-reading-list/${this.userEmail()}`;

    //to delete the book from local array created
    let index;
    for (let i = 0; i < this.readingList.length; i++) {
      if (this.readingList[i]._id === id) {
        index = i;
        break;
      }
    }
    this.readingList.splice(index, 1);
    //to delete the book from local array created
    let index1;
    for (let i = 0; i < this.displayList.length; i++) {
      if (this.displayList[i]._id === id) {
        index1 = i;
        break;
      }
    }
    this.displayList.splice(index1, 1);

    //if after deleting readingList length becomes 0
    if (this.displayList.length === 0) {
      this.isEmpty = true;
    }

    //updated User
    const updatedUser = {
      readingList: this.readingList,
    };

    //request to update book array
    this.httpClient.put<any>(url, updatedUser).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Book Removed successfully',
          summary: 'Your book was successfully removed from the reading List!',
          position: 'topCenter',
          duration: 1000,
        });
      },
      error: (err) => console.log(err),
    });
  }
}
