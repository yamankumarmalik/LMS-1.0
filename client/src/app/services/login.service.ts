import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { login } from '../models/login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  // signal which store userAdmin Login value if logged in or not (by default Log In)
  userAdmin = signal('');

  //signal to set user email or username
  userEmailSignal = signal('');

  //Loading-Spinner Variable
  isLoading = false;

  //base url for the json object for admin
  url = 'http://localhost:4000/user-api/login';
  //base url to check for user
  userURL = 'http://localhost:4000/libUser-api/login';

  //function to check admin credential from database
  checkAdmin(loginForm: any) {
    return this.httpClient.post<any>(this.url, loginForm);
  }

  //function to check user credential from database
  checkUser(loginForm: any) {
    return this.httpClient.post<any>(this.userURL, loginForm);
  }

  //function to add new user on the json server
  addNewUser(user: login) {
    const users = {
      username: user.username,
      password: user.password,
      readingList: [],
    };
    return this.httpClient.post<any>(
      'http://localhost:4000/libUser-api/create-libUser',
      users
    );
  }

  //variable for the search service (a signal so the user knows when the status changes)
  searchStatus = signal('');

  //function so that when user refreshes angular knows that user is still logged in
  checkUserToken() {
    if (localStorage.getItem('userToken')) {
      this.userAdmin.set('user');
    } else if (localStorage.getItem('adminToken')) {
      this.userAdmin.set('admin');
    } else {
      this.userAdmin.set('');
    }
  }

  //function to route to browse books on search
  route() {
    this.router.navigate(['/books']);
  }

  // to change login status using signal when we click on logOut
  changeLoginStatus() {
    if (this.userAdmin() === 'admin') {
      localStorage.removeItem('adminToken');
      this.userAdmin.set('');
    } else {
      localStorage.removeItem('userToken');
      this.userAdmin.set('');
    }
    this.router.navigate['/login'];
  }
}
