import React from 'react';
import Sidebar from "./components/sidebar/sideBar";
import {Overview} from "./components/overview/Overview";

export const App = () => {
    return (
        <div className="flex">
            <Sidebar isOpen={true} />
            <main className="flex-1">
                <Overview/>
            </main>
        </div>
    );
}