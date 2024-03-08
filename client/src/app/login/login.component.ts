import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  MinLengthValidator,
} from '@angular/forms';
//login service
import { LoginService } from '../services/login.service';
//ng-popup import
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  //inject login service
  loginService = inject(LoginService);

  //toast inject
  toast = inject(NgToastService);

  //inject Router
  router = inject(Router);

  //declaring the form group
  loginForm: FormGroup;

  //creating form Group
  ngOnInit(): void {
    //function to set login status
    this.loginService.checkUserToken();

    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{5,}'
        ),
      ]),
    });
  }

  isLogin: boolean = true;
  //on submit check whether the user is correct or not if correct route to the admin component
  onSubmit() {
    if (this.isLogin === true) {
      //send loginForm object as argument
      this.userLogin$ = this.loginService
        .checkUser(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.loginService.isLoading = true;
            if (res.message === 'Invalid username') {
              this.loginService.isLoading = false;
              return this.toast.error({
                detail: 'Please Enter a valid Username',
                summary: 'Username is invalid',
                position: 'topCenter',
                duration: 2000,
              });
            }
            if (res.message === 'Invalid password') {
              this.loginService.isLoading = false;
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
              this.loginService.userAdmin.set('user');
              //pop up message for success
              this.toast.success({
                detail: 'Login Success',
                summary: 'User Login is successful!',
                position: 'topCenter',
                duration: 1500,
              });
              //navigate to books
              this.loginService.userEmailSignal.set(res.payload.username);

              this.router.navigate(['/books']);
              this.loginService.isLoading = false;
            }
          },
          error: (error) => {
            console.log(error);
            this.loginService.isLoading = false;
          },
        });
    } else {
      //send loginForm object as argument to user check
      this.adminLogin$ = this.loginService
        .checkAdmin(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.loginService.isLoading = true;
            if (res.message === 'Invalid username') {
              this.loginService.isLoading = false;
              return this.toast.error({
                detail: 'Please Enter a valid Username',
                summary: 'Username is invalid',
                position: 'topCenter',
                duration: 2000,
              });
            }
            if (res.message === 'Invalid password') {
              this.loginService.isLoading = false;
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
              this.loginService.userAdmin.set('admin');
              //pop up message for success
              this.toast.success({
                detail: 'Login Success',
                summary: 'Admin Login is successful!',
                position: 'topCenter',
                duration: 1500,
              });
              //set username
              this.loginService.userEmailSignal.set(res.payload.username);

              //navigate to books
              this.router.navigate(['/books']);
              this.loginService.isLoading = false;
            }
          },
          error: (error) => {
            console.log(error);
            this.loginService.isLoading = false;
          },
        });
    }
  }

  //change User function
  changeUser() {
    this.isLogin = !this.isLogin;
  }

  //subscribe observable for adminLogin
  adminLogin$: Subscription;
  //subscribe observable for userLogin
  userLogin$: Subscription;
  //on destroy unsubscribe
  ngOnDestroy(): void {
    if (this.adminLogin$) {
      console.log(this.adminLogin$);
      this.adminLogin$.unsubscribe;
    }

    if (this.userLogin$) {
      this.userLogin$.unsubscribe;
    }
  }
}
