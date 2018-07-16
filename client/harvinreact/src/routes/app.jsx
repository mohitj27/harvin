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
import Login from '../containers/Login/Login.jsx';
import CreateTest from '../views/CreateTest/CreateTest.jsx';
import Questions from '../views/Questions/Questions.jsx';
import Activity from '../views/Activity/Activity.jsx';
const appRoutes = [
  {
    path: '/HarvinQuiz/home',
    sidebarName: 'Home',
    icon: Dashboard,
    component: Home,
  },
  {
    path: '/HarvinQuiz/createTest',
    sidebarName: 'Create Test',
    icon: Person,
    component: CreateTest,
  },
  {
    path: '/HarvinQuiz/addQues',
    sidebarName: 'Add Question',
    icon: NoteAdd,
    component: AddQues,
  },
  {
    path: '/HarvinQuiz/Tests',
    sidebarName: 'Tests',
    icon: NoteAdd,
    component: ListTest,
  },
  {
    path: '/HarvinQuiz/Questions',
    sidebarName: 'Questions',
    icon: NoteAdd,
    component: Questions,
  },
  {
    path: '/HarvinQuiz/Activity',
    sidebarName: 'Activity',
    icon: NoteAdd,
    component: Activity,
  },
  {
    path: '/HarvinQuiz/Logout',
    sidebarName: 'Log Out',
    icon: NoteAdd
  },
  {
    redirect: true,
    path: '/HarvinQuiz/',
    to: '/HarvinQuiz',
    navbarName: 'Redirect',
  }
];

export default appRoutes;
