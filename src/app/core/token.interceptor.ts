import {HttpInterceptorFn } from '@angular/common/http';


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");

  if (req.url.includes('/login')) {
    return next(req);
  }


  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  console.log("Token interceptor called", req, token);
  return next(req);
};
