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
import Register from "./views/Register";
import {Users} from "./views/Users";

export const routes = [
    {
        path: '/login',
        label: 'Login',
        component: Login,
        public: true,
    },
    {
        path: '/register',
        label: 'register',
        component: Register,
        roles: [3] // Admin only
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
        path: '/reports',
        label: 'Reports',
        component: Reports,
        roles: [1, 3] // Manager and Admin only
    },
    {
        path: '/team',
        label: 'Team',
        component: Team,
        roles: [1, 3] // Manager and Admin only
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
    }
];


export const sidebarRoutes = routes.filter(route => !route.public);