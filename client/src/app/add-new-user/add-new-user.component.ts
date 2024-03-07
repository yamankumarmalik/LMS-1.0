import { Component, inject, OnInit } from '@angular/core';
//import required form directives
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import loginService to add new users
import { LoginService } from '../services/login.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.css',
})
export class AddNewUserComponent implements OnInit {
  //inject loginService
  loginService = inject(LoginService);
  //inject toast Service
  toast = inject(NgToastService);

  //formGroup of the form with name
  addNewUser: FormGroup;

  //ngOnInit() is initialized when the component is loaded for the first time
  ngOnInit(): void {
    //function to set login status
    this.loginService.checkUserToken();
    
    this.addNewUser = new FormGroup({
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

  //function to be called when the user clicks submit button
  onSubmit() {
    this.loginService.addNewUser(this.addNewUser.value).subscribe({
      next: (res) => {
        if (res.message === 'User already existed') {
          return this.toast.error({
            detail: 'User with username already exists in the database!',
            summary: 'Please choose another username!',
            sticky: true,
            position: 'topCenter',
          });
        } else {
          this.toast.success({
            detail: 'New User was successfully inserted in database!',
            summary: 'Username: ' + res.payload.username,
            position: 'topCenter',
            duration: 1000,
          });
          this.addNewUser.reset();
        }
      },
      error: (err) => console.log(err),
    });
  }
}
