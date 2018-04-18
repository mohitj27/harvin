import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
} from 'material-ui-icons';
import DashboardPage from '../views/Dashboard/Dashboard.jsx';



const appRoutes = [
  {
    path: '/dashboard',
    sidebarName: 'Dashboard',
    icon: Dashboard,
    component: DashboardPage,
  },
  {
    path: '/makeoforder',
    sidebarName: 'Make Of Order',
    icon: Person,
    component: DashboardPage,
  },
  {
    path: '/makeofstock',
    sidebarName: 'Make Of Stock',
    icon: ContentPaste,
    component: DashboardPage,
  },
  {
    path: '/stats',
    sidebarName: 'Transactions',
    icon: LibraryBooks,
    component: DashboardPage,
  },

  {
    path: '/records',
    sidebarName: 'Records',
    icon: SdStorage,
    component: DashboardPage,
  },
  {
    redirect: true,
    path: '/',
    to: '/dashboard',
    navbarName: 'Redirect',
  },
];

export default appRoutes;
