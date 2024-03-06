import { Component, inject, OnInit } from '@angular/core';
//import forms
import { FormGroup, FormControl, Validators } from '@angular/forms';
//Books Service
import { BooksService } from '../services/books.service';
//Popup Service
import { NgToastService } from 'ng-angular-popup';

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

  //declaring form group
  addBookForm: FormGroup;

  //ngOnInit initializes the values when the component is loaded
  ngOnInit(): void {
    this.addBookForm = new FormGroup({
      isbn: new FormControl(null, [
        Validators.required,
        Validators.minLength(13),
      ]),
      title: new FormControl(null, Validators.required),
      genre: new FormControl(null, Validators.required),
      pageCount: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      altText: new FormControl(null, Validators.required),
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
