import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
  NoteAdd
} from 'material-ui-icons';
import DashboardPage from '../views/Dashboard/Dashboard.jsx';
import AddQues from '../views/AddQues/AddQues.jsx';
import Records from '../views/Records/Records.jsx';

const appRoutes = [
  {
    path: '/dashboard',
    sidebarName: 'Dashboard',
    icon: Dashboard,
    component: DashboardPage
  }, {
    path: '/makeoforder',
    sidebarName: 'Make Of Order',
    icon: Person,
    component: DashboardPage
  }, {
    path: '/makeofstock',
    sidebarName: 'Make Of Stock',
    icon: ContentPaste,
    component: DashboardPage
  }, {
    path: '/stats',
    sidebarName: 'Transactions',
    icon: LibraryBooks,
    component: DashboardPage
  }, {
    path: '/records',
    sidebarName: 'Records',
    icon: SdStorage,
    component: Records
  }, {
    path: '/addQues',
    sidebarName: 'Add Question',
    icon: NoteAdd,
    component: AddQues
  }, {
    redirect: true,
    path: '/',
    to: '/dashboard',
    navbarName: 'Redirect'
  }
];

export default appRoutes;
