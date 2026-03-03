import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import Aura from '@primeuix/themes/aura';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: { preset: Aura }
    }),
    provideHttpClient(
      withInterceptors([
        (req, next) => {

          const token = localStorage.getItem('auth_token');

          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: token.startsWith('Bearer')
                  ? token
                  : `Bearer ${token}`
              }
            });
          }

          return next(req);
        }
      ])
    )
  ]
});
