import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//booksService import
import { BooksService } from '../services/books.service';
//router import
import { Router } from '@angular/router';
//loginService import
import { LoginService } from '../services/login.service';
//import ng-popup
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.css',
})
export class UpdateBookComponent implements OnInit {
  //inject loginService
  loginService = inject(LoginService);

  //inject booksService
  bookService = inject(BooksService);

  // inject router
  router = inject(Router);

  //inject toast
  toast = inject(NgToastService);

  //form group name for updating books details
  updateBookForm = new FormGroup({
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

  ngOnInit(): void {
    //function to set login status
    this.loginService.checkUserToken();

    //calling the function showBook to set the default values in the form for user to edit
    this.bookService.showBook(this.bookService.bookId()).subscribe({
      next: (res) => {
        (this.bookService.id = res.payload.id),
          (this.bookService.isbn = res.payload.isbn),
          (this.bookService.title = res.payload.title),
          (this.bookService.genre = res.payload.genre),
          (this.bookService.pageCount = res.payload.pageCount),
          (this.bookService.price = res.payload.price),
          (this.bookService.quantity = res.payload.quantity),
          (this.bookService.author = res.payload.author),
          (this.bookService.image = res.payload.image),
          (this.bookService.altText = res.payload.altText);
        //to set the default values we can use patch value to overcome the problem of sending '' to server
        this.updateBookForm.patchValue({
          isbn: this.bookService.isbn,
          title: this.bookService.title,
          genre: this.bookService.genre,
          pageCount: this.bookService.pageCount,
          price: this.bookService.price,
          quantity: this.bookService.quantity,
          author: this.bookService.author,
          image: this.bookService.image,
          altText: this.bookService.altText,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //on Submit the user wants to update the book details in json server
  onSubmit() {
    //to update book in database
    this.bookService.updateBook(this.updateBookForm.value).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Book data updated!',
          summary: res.payload.title,
          position: 'topCenter',
          duration: 1000,
        });
        this.router.navigate(['/books']);
      },
      error: (err) => console.log(err),
    });
  }
}
