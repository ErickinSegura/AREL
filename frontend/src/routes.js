import Overview from './views/Overview';
import Backlog from './views/Backlog';
import Sprints from './views/Sprints';
import CalendarView from './views/Calendar';
import Shortcuts from './views/Shortcuts';
import AppSettings from './views/Settings';
import Login from './views/Login';

export const routes = [
    {
        path: '/login',
        label: 'Login',
        component: Login,
        public: true
    },
    {
        path: '/overview',
        label: 'Overview',
        component: Overview,
        hasSubmenu: true
    },
    {
        path: '/backlog',
        label: 'Backlog',
        component: Backlog,
    },
    {
        path: '/sprints',
        label: 'Sprints',
        component: Sprints,
    },
    {
        path: '/calendar',
        label: 'Calendar',
        component: CalendarView,
    },
    {
        path: '/shortcuts',
        label: 'Shortcuts',
        component: Shortcuts,
    },
    {
        path: '/settings',
        label: 'Settings',
        component: AppSettings,
    }
];

export const sidebarRoutes = routes.filter(route => !route.public);