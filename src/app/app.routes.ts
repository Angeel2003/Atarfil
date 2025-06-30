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
    path: 'operator-panel',
    loadComponent: () => import('./operator-panel/operator-panel.page').then( m => m.OperatorPanelPage)
  },
  {
    path: 'administrator-panel',
    loadComponent: () => import('./administrator-panel/administrator-panel.page').then( m => m.AdministratorPanelPage)
  },
  {
    path: 'user-management',
    loadComponent: () => import('./administrator-panel/user-management/user-management.page').then( m => m.UserManagementPage)
  },
  {
    path: 'incidents',
    loadComponent: () => import('./administrator-panel/incidents/incidents.page').then( m => m.IncidentsPage)
  },
  {
    path: 'pdf-reports',
    loadComponent: () => import('./administrator-panel/pdf-reports/pdf-reports.page').then( m => m.PdfReportsPage)
  },
  {
    path: 'add-user',
    loadComponent: () => import('./administrator-panel/user-management/add-user/add-user.page').then( m => m.AddUserPage)
  },
  {
    path: 'add-urgent-task',
    loadComponent: () => import('./administrator-panel/incidents/add-urgent-task/add-urgent-task.page').then( m => m.AddUrgentTaskPage)
  },
  {
    path: 'add-periodic-task',
    loadComponent: () => import('./administrator-panel/incidents/add-periodic-task/add-periodic-task.page').then( m => m.AddPeriodicTaskPage)
  },
  {
    path: 'incident-detail',
    loadComponent: () => import('./administrator-panel/incidents/incident-detail/incident-detail.page').then( m => m.IncidentDetailPage)
  },
  {
    path: 'urgent-task-detail',
    loadComponent: () => import('./operator-panel/urgent-task-detail/urgent-task-detail.page').then( m => m.UrgentTaskDetailPage)
  },
  {
    path: 'periodic-task-detail',
    loadComponent: () => import('./operator-panel/periodic-task-detail/periodic-task-detail.page').then( m => m.PeriodicTaskDetailPage)
  },  {
    path: 'completed-task-detail',
    loadComponent: () => import('./administrator-panel/incidents/completed-task-detail/completed-task-detail.page').then( m => m.CompletedTaskDetailPage)
  },
  {
    path: 'subtask-detail',
    loadComponent: () => import('./operator-panel/periodic-task-detail/subtask-detail/subtask-detail.page').then( m => m.SubtaskDetailPage)
  },
  {
    path: 'action-material-management',
    loadComponent: () => import('./administrator-panel/action-material-management/action-material-management.page').then( m => m.ActionMaterialManagementPage)
  },
  {
    path: 'add-action',
    loadComponent: () => import('./administrator-panel/action-material-management/add-action/add-action.page').then( m => m.AddActionPage)
  },
  {
    path: 'add-material',
    loadComponent: () => import('./administrator-panel/action-material-management/add-material/add-material.page').then( m => m.AddMaterialPage)
  },
  {
    path: 'create-task',
    loadComponent: () => import('./operator-panel/create-task/create-task.page').then( m => m.CreateTaskPage)
  },
  {
    path: 'manuals',
    loadComponent: () => import('./administrator-panel/manuals/manuals.page').then( m => m.ManualsPage)
  }


];
