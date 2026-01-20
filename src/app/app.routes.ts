import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Solicitud } from './pages/solicitud-174/solicitud';
import { Solicitud075 } from './pages/solicitud-075/solicitud';

export const routes: Routes = [
    {
    path: '',
    component: Home
  },
  {
    path: 'solicitud174/:radicado/:ciudad',
    component: Solicitud
  },
  {
    path: 'solicitud075/:radicado/:ciudad',
    component: Solicitud075
  },
  {
    path: '**',
    redirectTo: ''
  }
];
