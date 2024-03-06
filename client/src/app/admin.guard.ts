import { NgTemplateOutlet } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(NgToastService);

  if (localStorage.getItem('adminToken')) {
    return true;
  } else {
    toast.error({
      detail: 'Unauthorized Access',
      summary: 'Please login',
      position: 'topCenter',
      duration: 1000,
    });
    router.navigate(['/login']);
  }
};
