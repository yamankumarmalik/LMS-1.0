import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
//booksService import
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, OnDestroy {
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
  //baseUrl for books array
  baseUrl: string = 'http://localhost:4000/books-api/all-books';
  // variable to store user info
  username: string;
  readingList: any[];

  //ngOnInit function initializes the values when the component is loaded
  ngOnInit(): void {
    //function to set login status
    this.loginService.checkUserToken();

    //set headerSearch signal value when component is loaded
    this.bookService.headerSearch.set('browse');

    this.getBooks$ = this.httpClient.get<any>(this.baseUrl).subscribe({
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

    if (this.loginService.userAdmin() === 'user') {
      //to get user object
      const userURL = `http://localhost:4000/libUser-api/getUser/${this.loginService.userEmailSignal()}`;
      this.getReadingList$ = this.httpClient.get<any>(userURL).subscribe({
        next: (res) => {
          this.username = res.payload.username;
          this.readingList = res.payload.readingList;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  //function to be called when user click deleteBook button
  deleteBook(id: string) {
    this.deleteBook$ = this.bookService.deleteBook(id).subscribe({
      next: (res) => {
        if (res.message === 'Book Deleted') {
          this.toast.success({
            detail: 'Book Deleted',
            summary:
              'Book with tile' + res.payload.title + 'deleted successfully.',
            position: 'topCenter',
            duration: 1000, //duration in ms
          });
          //to delete the book from local array created
          let index;
          for (let i = 0; i < this.book.length; i++) {
            if (this.book[i].id === id) {
              index = i;
              break;
            }
          }
          this.book.splice(index, 1);
        }
      },
      error: (err) => console.log(err),
    });
  }

  // when the user click on update book we route him to the updateBook component
  showBook(id: string) {
    this.bookService.bookId.set(id);
    this.router.navigate(['/updateBook']);
  }

  //function to add book to ReadingList in server
  addToReadingList(id: string) {
    //url for updating readingList array of User
    const url: string = `http://localhost:4000/libUser-api/add-reading-list/${this.username}`;

    const findBook = this.readingList.find(function (book) {
      return book === id;
    });
    //error handling if reading list is empty
    if (this.readingList.length === 0) {
      this.readingList.push(id);
      const updatedUser = {
        username: this.username,
        readingList: this.readingList,
      };
      return (this.updateReadingList$ = this.httpClient
        .put<any>(url, updatedUser)
        .subscribe({
          next: (res) => {
            this.toast.success({
              detail: 'Book Added successfully',
              summary: 'Your book was added to your Reading List!',
              position: 'topCenter',
              duration: 2000,
            });
          },
          error: (err) => {
            console.log(err);
          },
        }));
    } else {
      if (findBook !== undefined) {
        return this.toast.error({
          detail: 'Book already present in reading list!',
          summary: 'Please add another book',
          position: 'topCenter',
          duration: 1000,
        });
      } else {
        this.readingList.push(id);
        const updatedUser = {
          username: this.username,
          readingList: this.readingList,
        };
        return (this.updateReadingList$ = this.httpClient
          .put<any>(url, updatedUser)
          .subscribe({
            next: (res) => {
              this.toast.success({
                detail: 'Book Added successfully',
                summary: 'Added to Reading LIst',
                position: 'topCenter',
                duration: 2000,
              });
            },
            error: (err) => {
              console.log(err);
            },
          }));
      }
    }
  }

  //getBooks subscribe to initialize books array
  getBooks$: Subscription;

  //getReading list to initialize readingList so that user can push into readingList
  getReadingList$: Subscription;

  //delete book from database
  deleteBook$: Subscription;

  //add book to reading list
  updateReadingList$: Subscription;

  //when component is destroyed
  ngOnDestroy(): void {
    this.bookService.headerSearch.set('');

    //unsubscribe all subscriptions
    if (this.getBooks$) {
      this.getBooks$.unsubscribe;
    }

    if (this.getReadingList$) {
      this.getReadingList$.unsubscribe;
    }

    if (this.deleteBook$) {
      this.deleteBook$.unsubscribe;
    }

    if (this.updateReadingList$) {
      this.updateReadingList$.unsubscribe;
    }
  }
}
