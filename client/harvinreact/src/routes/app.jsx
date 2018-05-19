import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  NoteAdd
} from "material-ui-icons";
import DashboardPage from "../views/Dashboard/Dashboard.jsx";
import Home from "../views/Home/Home.jsx";
import AddQues from "../views/AddQues/AddQues.jsx";
import ListTest from "../views/ListTest/ListTest.jsx";
import CreateTest from "../views/CreateTest/CreateTest.jsx";
const appRoutes = [
  {
    path: "/home",
    sidebarName: "Home",
    icon: Dashboard,
    component: Home
  },
  {
    path: "/createTest",
    sidebarName: "Create Test",
    icon: Person,
    component: CreateTest
  },
  {
    path: "/addQues",
    sidebarName: "Add Question",
    icon: NoteAdd,
    component: AddQues
  },
  {
    path: "/Tests",
    sidebarName: "Tests",
    icon: NoteAdd,
    component: ListTest
  },
  {
    redirect: true,
    path: "/",
    to: "/dashboard",
    navbarName: "Redirect"
  }
];

export default appRoutes;
