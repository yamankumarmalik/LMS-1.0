import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

export const appHttpInterceptor: HttpInterceptor = {
  intercept: (req: HttpRequest<any>, next: HttpHandler) => {
    let token: string | null =
      localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          authorization: token,
        },
      });
    }
    return next.handle(req);
  },
};
