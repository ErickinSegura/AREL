import Overview from './views/Overview/Overview';
import Backlog from './views/Backlog';
import Sprints from './views/SprintManagement';
import CalendarView from './views/Calendar';
import Shortcuts from './views/Shortcuts';
import AppSettings from './views/Settings';
import Login from './views/Login';
import Team from './views/Team';
import Reports from './views/Reports';
import MyTasks from './views/MyTasks';
import {Users} from "./views/Users";
import UserSettings from "./views/UserSettings";

export const routes = [
    {
        path: '/login',
        label: 'Login',
        component: Login,
        public: true,
    },
    {
        path: '/overview',
        label: 'Overview',
        component: Overview,
        hasSubmenu: true,
        roles: [1, 2, 3] // All roles can access
    },
    {
        path: '/backlog',
        label: 'Backlog',
        component: Backlog,
        roles: [1, 2, 3] // All roles can access
    },
    {
        path: '/sprints',
        label: 'Sprints',
        component: Sprints,
        roles: [1, 2, 3] // All roles can access
    },
    {
        path: '/my-tasks',
        label: 'My Tasks',
        component: MyTasks,
        roles: [2] // Developer only
    },
    {
        path: '/users',
        label: 'Users',
        component: Users,
        roles: [3] // Admin only
    },
    {
        path: '/calendar',
        label: 'Calendar',
        component: CalendarView,
        roles: [1, 2, 3] // All roles can access
    },
    {
        path: '/shortcuts',
        label: 'Shortcuts',
        component: Shortcuts,
        roles: [1, 2, 3] // All roles can access
    },
    {
        path: '/settings',
        label: 'Settings',
        component: AppSettings,
        roles: [1, 2, 3] // All roles can access
    },
    {
        path: '/usersettings',
        label: 'User Settings',
        component: UserSettings,
        roles: [1, 2, 3] // All roles can access
    }
];


export const sidebarRoutes = routes.filter(route => !route.public);