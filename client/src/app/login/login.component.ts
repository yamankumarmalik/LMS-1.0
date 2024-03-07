import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  MinLengthValidator,
} from '@angular/forms';
//login service
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginService = inject(LoginService);

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
      this.loginService.checkUser(this.loginForm.value);
    } else {
      //send loginForm object as argument to user check
      this.loginService.checkAdmin(this.loginForm.value);
    }
  }

  //change User function
  changeUser() {
    this.isLogin = !this.isLogin;
  }
}
