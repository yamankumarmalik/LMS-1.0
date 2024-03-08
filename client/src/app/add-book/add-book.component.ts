import { Component, inject, OnInit, OnDestroy } from '@angular/core';
//import forms
import { FormGroup, FormControl, Validators } from '@angular/forms';
//Books Service
import { BooksService } from '../services/books.service';
//Popup Service
import { NgToastService } from 'ng-angular-popup';
//loginService
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css',
})
export class AddBookComponent implements OnInit, OnDestroy {
  //inject Book Service
  bookService = inject(BooksService);
  //inject Popup Service
  toast = inject(NgToastService);
  //inject Login Service
  loginService = inject(LoginService);

  //declaring form group
  addBookForm: FormGroup;

  //ngOnInit initializes the values when the component is loaded
  ngOnInit(): void {
    //function to set login status
    this.loginService.checkUserToken();

    this.addBookForm = new FormGroup({
      isbn: new FormControl(null, [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
      ]),
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^(?!\\s)[a-zA-Z ]*(?<!\\s)$'),
      ]),
      genre: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(?!\\s)[a-zA-Z ]*(?<!\\s)$'),
        Validators.maxLength(25),
      ]),
      pageCount: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4),
      ]),
      price: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
      ]),
      quantity: new FormControl(null, [
        Validators.required,
        Validators.maxLength(2),
      ]),
      author: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(?!\\s)[a-zA-Z ]*(?<!\\s)$'),
        Validators.maxLength(50),
      ]),
      image: new FormControl(null, [
        Validators.required,
        Validators.maxLength(150),
      ]),
      altText: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(?!\\s)[a-zA-Z ]*(?<!\\s)$'),
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
    });
  }

  //button to submit the form when clicked
  onSubmit() {
    this.addBook$ = this.bookService.addBook(this.addBookForm.value).subscribe({
      next: (res) => {
        //to alert the user that the book has been added successfully we are using toast
        if (res.message === 'Book already in the database!') {
          return this.toast.error({
            detail: 'Book already exists!',
            summary: 'Please enter another book!',
            sticky: true,
            position: 'topCenter',
          });
        } else {
          this.toast.success({
            detail: 'Book Added',
            summary: 'Title' + res.payload.title,
            position: 'topCenter',
            duration: 5000,
          });
        }
      },
      error: (err) => console.log(err),
    });
  }

  //addBook observable
  addBook$: Subscription;
  //when component is destroyed
  ngOnDestroy(): void {
    //unsubscribe addBook
    if (this.addBook$) {
      this.addBook$.unsubscribe;
    }
  }
}
