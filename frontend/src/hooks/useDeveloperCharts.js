import { useState, useEffect } from 'react';
import _ from 'lodash';

export const useDeveloperCharts = (userPerformances, loading) => {
    const [chartData, setChartData] = useState({
        hours: [],
        tasks: []
    });
    const [sprintNumbers, setSprintNumbers] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [colors, setColors] = useState({});

    const colorPalette = ['#EA6447', '#C74634', '#F80000', '#312D2A', '#EC4899', '#6366F1', '#F59E0B'];

    useEffect(() => {
        if (userPerformances && userPerformances.length > 0) {
            const uniqueDevelopers = _.uniqBy(userPerformances, 'userName').map(dev => dev.userName);
            setDevelopers(uniqueDevelopers);

            const hoursSprintNumbers = _.uniqBy(userPerformances.filter(item => item.totalRealHours > 0), 'sprintNumber')
                .map(sprint => sprint.sprintNumber)
                .sort((a, b) => a - b);

            const tasksSprintNumbers = _.uniqBy(userPerformances.filter(item => item.completedTasks > 0), 'sprintNumber')
                .map(sprint => sprint.sprintNumber)
                .sort((a, b) => a - b);

            const uniqueSprints = _.union(hoursSprintNumbers, tasksSprintNumbers).sort((a, b) => a - b);
            setSprintNumbers(uniqueSprints);

            const developerColors = {};
            uniqueDevelopers.forEach((dev, index) => {
                developerColors[dev] = colorPalette[index % colorPalette.length];
            });
            setColors(developerColors);

            const hoursData = hoursSprintNumbers.map(sprintNumber => {
                const sprintData = {
                    name: `Sprint ${sprintNumber}`,
                };

                uniqueDevelopers.forEach(developer => {
                    const entry = userPerformances.find(
                        item => item.userName === developer && item.sprintNumber === sprintNumber
                    );

                    sprintData[developer] = entry ? entry.totalRealHours : 0;
                });

                return sprintData;
            });

            const tasksData = tasksSprintNumbers.map(sprintNumber => {
                const sprintData = {
                    name: `Sprint ${sprintNumber}`,
                };

                uniqueDevelopers.forEach(developer => {
                    const entry = userPerformances.find(
                        item => item.userName === developer && item.sprintNumber === sprintNumber
                    );

                    sprintData[developer] = entry ? entry.completedTasks : 0;
                });

                return sprintData;
            });

            setChartData({
                hours: hoursData,
                tasks: tasksData
            });
        }
    }, [userPerformances]);

    return {
        chartData,
        developers,
        colors,
        isDataLoading: loading
    };
};