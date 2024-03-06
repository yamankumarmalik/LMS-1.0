import { Component, inject } from '@angular/core';
//router to navigate to other components
import { Router } from '@angular/router';
//login Service
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  //inject the login Service
  loginService = inject(LoginService);

  //variable to store login status (Log in or out)
  loginStatus;

  //can also initialize services in constructor
  constructor(private router: Router) {
    this.loginStatus = this.loginService.userAdmin;
  }

  // to change login status using signal when we click on logOut
  changeLoginStatus() {
    if(this.loginService.userAdmin() === 'admin'){
      localStorage.removeItem('adminToken');
    }else{
      localStorage.removeItem('userToken');
    }
    this.loginService.userAdmin.set('');
    this.router.navigate['/login'];
  }

  // variable to receive the text which user types in the search bar
  searchText = '';
  // when the user searches for any particular book
  onSearch() {
    //setting the value of the signal when user clicks the search button
    this.loginService.searchStatus.set(this.searchText);
    //route to the browse books component if on another component
    this.router.navigate(['/books']);
  }
}
