import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//booksService import
import { BooksService } from '../services/books.service';
//router import
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.css',
})
export class UpdateBookComponent implements OnInit {
  //inject booksService
  bookService = inject(BooksService);
  // inject router
  router = inject(Router);
  //form group name for updating books details
  updateBookForm = new FormGroup({
    isbn: new FormControl(''),
    title: new FormControl(''),
    genre: new FormControl(''),
    pageCount: new FormControl(''),
    price: new FormControl(''),
    quantity: new FormControl(''),
    author: new FormControl(''),
    image: new FormControl(''),
    altText: new FormControl(''),
  });
  ngOnInit(): void {
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
        //to set the default values we can use patch value to overcome the problem of sending null to server
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
    // make a copy of that object and change the values in that object and pass it in the function so as to solve the null problem using spread operator
    if (window.confirm('Are you sure you want to update this book entry?')) {
      this.bookService.updateBook(this.updateBookForm.value).subscribe({
        next: (res) => {
          alert('Your book entry has been updated successfully');
          this.router.navigate(['/books']);
        },
        error: (err) => console.log(err),
      });
    }
  }
}
