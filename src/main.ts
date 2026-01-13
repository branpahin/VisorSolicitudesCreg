import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import Aura from '@primeng/themes/aura';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: { preset: Aura }
    })
  ]
});
