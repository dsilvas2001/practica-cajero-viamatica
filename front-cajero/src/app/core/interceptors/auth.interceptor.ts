import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        const cloned = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`),
        });
        return next.handle(cloned);
      }
    }

    return next.handle(request);
  }
}
