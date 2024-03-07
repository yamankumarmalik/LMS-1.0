import { NgTemplateOutlet } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { LoginService } from '../services/login.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(NgToastService);
  const httpClient = inject(HttpClient);
  const loginService = inject(LoginService);

  const token = localStorage.getItem('adminToken');
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
