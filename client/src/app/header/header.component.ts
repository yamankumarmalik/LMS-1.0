import { Component, inject, OnInit } from '@angular/core';
//router to navigate to other components
import { Router } from '@angular/router';
//login Service
import { LoginService } from '../services/login.service';
//book Service
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  //inject the login Service
  loginService = inject(LoginService);
  //inject book Service
  bookService = inject(BooksService);

  //can also initialize services in constructor
  constructor(private router: Router) {}

  ngOnInit(): void {}

  // variable to receive the text which user types in the search bar
  searchText = '';
  // when the user searches for any particular book
  onSearch() {
    //route to the browse books component if on another component
    this.router.navigate(['/books']);
    //setting the value of the signal when user clicks the search button
    this.loginService.searchStatus.set(this.searchText);
  }

  //when user clicks on login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
