import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
  NoteAdd
} from 'material-ui-icons';
import DashboardPage from '../views/Dashboard/Dashboard.jsx';
import Home from '../views/Home/Home.jsx';
import AddQues from '../views/AddQues/AddQues.jsx';

const appRoutes = [
  {
    path: '/home',
    sidebarName: 'Home',
    icon: Dashboard,
    component: Home,
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
