import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  //loginService
  loginService = inject(LoginService);

  ngOnInit(): void {
    //function to set login status
    this.loginService.checkUserToken();
  }
}
