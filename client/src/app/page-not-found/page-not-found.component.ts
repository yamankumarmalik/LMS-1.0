import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent implements OnInit {
  //inject login service
  loginService = inject(LoginService);

  ngOnInit(): void {
    //function to set login status
    this.loginService.checkUserToken();
  }
}
