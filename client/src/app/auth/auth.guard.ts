import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from '../services/login.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(NgToastService);
  const httpClient = inject(HttpClient);
  const loginService = inject(LoginService);

  const token = localStorage.getItem('userToken');
  if (token) {
    return httpClient
      .get<any>('http://localhost:4000/user-api/verifyToken')
      .pipe(
        map((res) => {
          if (res.message === 'Token verified') {
            return true;
          }
          toast.error({
            detail: 'Please login to access this page',
            summary: 'Unauthorized Access',
            position: 'topCenter',
            duration: 1000,
          });
          loginService.changeLoginStatus();
          router.navigate(['/login']);
          return false;
        })
      );
  }
  toast.error({
    detail: 'Please login to access this page',
    summary: 'Unauthorized Access',
    position: 'topCenter',
    duration: 1000,
  });
  loginService.changeLoginStatus();
  router.navigate(['/login']);
  return false;
};
