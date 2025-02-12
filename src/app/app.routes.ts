import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'change-password',
    loadComponent: () => import('./home/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  {
    path: 'select-place',
    loadComponent: () => import('./home/select-place/select-place.page').then( m => m.SelectPlacePage)
  },
  {
    path: 'select-zone',
    loadComponent: () => import('./home/select-place/select-zone/select-zone.page').then( m => m.SelectZonePage)
  },
  {
    path: 'operator-panel',
    loadComponent: () => import('./operator-panel/operator-panel.page').then( m => m.OperatorPanelPage)
  },
  {
    path: 'administrator-panel',
    loadComponent: () => import('./administrator-panel/administrator-panel.page').then( m => m.AdministratorPanelPage)
  },
];
