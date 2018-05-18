import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
  NoteAdd
} from "material-ui-icons";
import DashboardPage from "../views/Dashboard/Dashboard.jsx";
import Home from "../views/Home/Home.jsx";
import AddQues from "../views/AddQues/AddQues.jsx";
import ListTest from "../views/ListTest/ListTest.jsx";
import CreateTest from "../views/CreateTest/CreateTest.jsx";
import Instruction from "../views/Instruction/Instruction.jsx";
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
    path: "/instuction",
    sidebarName: "Instruction",
    icon: ContentPaste,
    component: Instruction
  },
  {
    path: "/stats",
    sidebarName: "Transactions",
    icon: LibraryBooks,
    component: DashboardPage
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
