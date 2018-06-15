import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  NoteAdd,
  Delete
} from 'material-ui-icons';
import DashboardPage from '../views/Dashboard/Dashboard.jsx';
import Home from '../views/Home/Home.jsx';
import AddQues from '../views/AddQues/AddQues.jsx';
import ListTest from '../views/ListTest/ListTest.jsx';
import CreateTest from '../views/CreateTest/CreateTest.jsx';
import Questions from '../views/Questions/Questions.jsx';
import Activity from '../views/Activity/Activity.jsx';
const appRoutes = [
  {
    path: '/home',
    sidebarName: 'Home',
    icon: Dashboard,
    component: Home,
  },
  {
    path: '/createTest',
    sidebarName: 'Create Test',
    icon: Person,
    component: CreateTest,
  },
  {
    path: '/addQues',
    sidebarName: 'Add Question',
    icon: NoteAdd,
    component: AddQues,
  },
  {
    path: '/Tests',
    sidebarName: 'Tests',
    icon: NoteAdd,
    component: ListTest,
  },
  {
    path: '/Questions',
    sidebarName: 'Questions',
    icon: NoteAdd,
    component: Questions,
  },
  {
    path: '/Activity',
    sidebarName: 'Activity',
    icon: NoteAdd,
    component: Activity,
  },
  {
    redirect: true,
    path: '/',
    to: '/dashboard',
    navbarName: 'Redirect',
  },
];

export default appRoutes;
