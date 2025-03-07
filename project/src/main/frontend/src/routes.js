import Overview from './views/Overview';
import Backlog from './views/Backlog';
import Sprints from './views/Sprints';
import CalendarView from './views/Calendar';
import Shortcuts from './views/Shortcuts';
import AppSettings from './views/Settings';

export const routes = [
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