import { HttpInterceptorFn } from '@angular/common/http';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          authorization: token
        }
      });
    }
    return next(req);
  }

