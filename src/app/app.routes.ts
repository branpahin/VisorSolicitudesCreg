import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Solicitud } from './pages/solicitud/solicitud';

export const routes: Routes = [
    {
    path: '',
    component: Home
  },
  {
    path: 'solicitud/:radicado/:ciudad',
    component: Solicitud
  },
  {
    path: '**',
    redirectTo: ''
  }
];
