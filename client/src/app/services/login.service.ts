import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { login } from '../models/login';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toast: NgToastService
  ) {}

  // signal which store userAdmin Login value if logged in or not (by default Log In)
  userAdmin = signal('');

  userEmailSignal = signal('');
  //Loading-Spinner Variable
  isLoading = false;

  //base url for the json object for admin
  url = 'http://localhost:4000/user-api/login';
  //base url to check for user
  userURL = 'http://localhost:4000/libUser-api/login';

  //function to check admin credential from database
  checkAdmin(loginForm: any) {
    this.httpClient.post<any>(this.url, loginForm).subscribe({
      next: (res) => {
        this.isLoading = true;
        if (res.message === 'Invalid username') {
          this.isLoading = false;
          return this.toast.error({
            detail: 'Please Enter a valid Username',
            summary: 'Username is invalid',
            position: 'topCenter',
            duration: 2000,
          });
        }
        if (res.message === 'Invalid password') {
          this.isLoading = false;
          return this.toast.error({
            detail: 'Please Enter the correct Password',
            summary: 'Password is incorrect!',
            position: 'topCenter',
            duration: 2000,
          });
        }
        if (res.message === 'login success') {
          //store token in local/session storage
          localStorage.setItem('adminToken', res.token);
          //set user status & current user to service
          this.userAdmin.set('admin');
          //pop up message for success
          this.toast.success({
            detail: 'Login Success',
            summary: 'Admin Login is successful!',
            position: 'topCenter',
            duration: 1500,
          });
          //navigate to books
          // this.userEmailSignal.set(res.payload.username);
          console.log(res.payload);
          this.router.navigate(['/books']);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  //function to check user credential from database
  checkUser(loginForm: any) {
    this.httpClient.post<any>(this.userURL, loginForm).subscribe({
      next: (res) => {
        this.isLoading = true;
        if (res.message === 'Invalid username') {
          this.isLoading = false;
          return this.toast.error({
            detail: 'Please Enter a valid Username',
            summary: 'Username is invalid',
            position: 'topCenter',
            duration: 2000,
          });
        }
        if (res.message === 'Invalid password') {
          this.isLoading = false;
          return this.toast.error({
            detail: 'Please Enter the correct Password',
            summary: 'Password is incorrect!',
            position: 'topCenter',
            duration: 2000,
          });
        }
        if (res.message === 'login success') {
          //store token in local/session storage
          localStorage.setItem('userToken', res.token);
          //set user status & current user to service
          this.userAdmin.set('user');
          //pop up message for success
          this.toast.success({
            detail: 'Login Success',
            summary: 'User Login is successful!',
            position: 'topCenter',
            duration: 1500,
          });
          //navigate to books
          this.userEmailSignal.set(res.payload.username);

          this.router.navigate(['/books']);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
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
    }
  }

  //function to route to browse books on search
  route() {
    this.router.navigate(['/books']);
  }
}
