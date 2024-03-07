import { Component, inject, OnInit } from '@angular/core';
//import forms
import { FormGroup, FormControl, Validators } from '@angular/forms';
//Books Service
import { BooksService } from '../services/books.service';
//Popup Service
import { NgToastService } from 'ng-angular-popup';
//loginService
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css',
})
export class AddBookComponent implements OnInit {
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
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern('^(a-zA-Z )*$'),
      ]),
      genre: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(a-zA-Z )*$'),
        Validators.minLength(1),
        Validators.maxLength(25),
      ]),
      pageCount: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
      ]),
      price: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
      ]),
      quantity: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ]),
      author: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(a-zA-Z )*$'),
        Validators.minLength(1),
        Validators.maxLength(50),
      ]),
      image: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]),
      altText: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(a-zA-Z )*$'),
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
    });
  }

  //button to submit the form when clicked
  onSubmit() {
    this.bookService.addBook(this.addBookForm.value).subscribe({
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
}
