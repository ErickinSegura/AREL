import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    Image,
} from "@react-pdf/renderer";
import { Html } from 'react-pdf-html';

import { OPENAI_API_KEY } from './api';
import { colors, styles, instructions } from "./PDFConstants";

// Lazy loading for OpenAI client
let openAiClient = null;

const getOpenAiClient = async () => {
    if (!openAiClient) {
        const OpenAi = (await import('openai')).default;
        openAiClient = new OpenAi({
            apiKey: OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
        });
    }
    return openAiClient;
};

// Cache for AI responses
const aiResponseCache = new Map();

export const AICall = async (projectData) => {
    try {
        // Generate a cache key based on the project data
        const cacheKey = JSON.stringify(projectData);

        // Check if we have a cached response
        if (aiResponseCache.has(cacheKey)) {
            console.log("Using cached AI response");
            return aiResponseCache.get(cacheKey);
        }

        // Lazy load the OpenAI client
        const client = await getOpenAiClient();

        // Make the API call
        const response = await client.responses.create({
            model: "gpt-4.1",
            instructions,
            input: `Here is my project data in JSON: ${JSON.stringify(
                projectData,
                null,
                2
            )}. Please apply the instructions and extract key insights from this project.`,
        });

        // Cache the response
        aiResponseCache.set(cacheKey, response.output_text);

        return response.output_text;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        // Return a fallback HTML in case of error
        return `
            <div class="insightSection">
                <h3 class="insightTitle">Error Generating Insights</h3>
                <p class="insightText">
                    We encountered an error while generating AI insights. Please try again later.
                </p>
            </div>
        `;
    }
};

const prepareChartData = (projectData) => {
    return projectData.map(sprint => ({
        name: `Sprint ${sprint.sprintNumber}`,
        Estimated: sprint.totalEstimatedHours,
        Actual: sprint.totalRealHours,
        Efficiency: parseFloat(((sprint.hoursSpentOnCompleted / sprint.totalEstimatedHours) * 100).toFixed(1))
    }));
};

const calculateStats = (projectData) => {
    const totalTasks = projectData.reduce((sum, sprint) => sum + sprint.totalTasks, 0);
    const completedTasks = projectData.reduce((sum, sprint) => sum + sprint.completedTasks, 0);
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : "0.0";
    const totalEstimatedHours = projectData.reduce((sum, sprint) => sum + sprint.totalEstimatedHours, 0);
    const totalRealHours = projectData.reduce((sum, sprint) => sum + sprint.totalRealHours, 0);

    const sprintEfficiency = projectData.map(sprint => ({
        sprintNumber: sprint.sprintNumber,
        efficiency: sprint.totalEstimatedHours > 0 ? sprint.hoursSpentOnCompleted / sprint.totalEstimatedHours : 0,
        efficiencyPercent: sprint.totalEstimatedHours > 0 ?
            ((sprint.hoursSpentOnCompleted / sprint.totalEstimatedHours) * 100).toFixed(0) : "0"
    }));

    const mostEfficientSprint = sprintEfficiency.length > 0 ?
        [...sprintEfficiency].sort((a, b) => b.efficiency - a.efficiency)[0] :
        { sprintNumber: 0, efficiency: 0, efficiencyPercent: "0" };

    const leastEfficientSprint = sprintEfficiency.length > 0 ?
        [...sprintEfficiency].sort((a, b) => a.efficiency - b.efficiency)[0] :
        { sprintNumber: 0, efficiency: 0, efficiencyPercent: "0" };

    return {
        totalTasks,
        completedTasks,
        completionRate,
        totalEstimatedHours,
        totalRealHours,
        mostEfficientSprint,
        leastEfficientSprint,
        remainingTasks: totalTasks - completedTasks,
        sprintEfficiency
    };
};

const SprintEfficiencyVisual = ({ sprintEfficiency }) => {
    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 0.4) return { backgroundColor: colors.accentGreen };
        if (efficiency >= 0.3) return { backgroundColor: '#FFC107' }; // Amber
        return { backgroundColor: colors.accentRed };
    };

    return (
        <View style={styles.sprintEfficiencyContainer}>
            {sprintEfficiency.map((sprint) => (
                <View key={sprint.sprintNumber} style={styles.sprintEfficiencyBlock}>
                    <View style={[styles.efficiencyCircle, getEfficiencyColor(sprint.efficiency)]}>
                        <Text style={styles.efficiencyValue}>{sprint.efficiencyPercent}%</Text>
                    </View>
                    <Text style={styles.sprintLabel}>Sprint {sprint.sprintNumber}</Text>
                </View>
            ))}
        </View>
    );
};

const HoursBarChart = ({ projectData }) => {
    const maxEstimatedHours = Math.max(...projectData.map(sprint => sprint.totalEstimatedHours)) || 1;

    return (
        <View>
            <View style={styles.barChartContainer}>
                {projectData.map((sprint) => {
                    const estimatedHeight = (sprint.totalEstimatedHours / maxEstimatedHours) * 100;
                    const actualHeight = (sprint.totalRealHours / maxEstimatedHours) * 100;

                    return (
                        <View key={sprint.sprintNumber} style={styles.barContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <View style={[styles.barEstimated, { height: estimatedHeight }]} />
                                <View style={[styles.barActual, { height: actualHeight }]} />
                            </View>
                            <Text style={styles.barLabel}>Sprint {sprint.sprintNumber}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Legend */}
            <View style={styles.barLegendContainer}>
                <View style={styles.barLegendItem}>
                    <View style={[styles.barLegendColor, { backgroundColor: colors.secondaryRed }]} />
                    <Text style={styles.barLegendText}>Estimated Hours</Text>
                </View>
                <View style={styles.barLegendItem}>
                    <View style={[styles.barLegendColor, { backgroundColor: colors.primaryRed }]} />
                    <Text style={styles.barLegendText}>Actual Hours</Text>
                </View>
            </View>
        </View>
    );
};

// Team Performance component
const TeamPerformanceSection = ({ userPerformances }) => {
    if (!userPerformances || userPerformances.length === 0) {
        return null;
    }

    // Group users by sprint
    const usersBySprintMap = userPerformances.reduce((acc, user) => {
        const sprintKey = `Sprint ${user.sprintNumber}`;
        if (!acc[sprintKey]) {
            acc[sprintKey] = [];
        }
        acc[sprintKey].push(user);
        return acc;
    }, {});

    // Sort sprints by number
    const sortedSprints = Object.keys(usersBySprintMap).sort((a, b) => {
        const sprintNumA = parseInt(a.replace('Sprint ', ''));
        const sprintNumB = parseInt(b.replace('Sprint ', ''));
        return sprintNumA - sprintNumB;
    });

    return (
        <View style={styles.teamPerformanceContainer} wrap={false}>
            <Text style={styles.sectionTitle}>Team Performance</Text>

            {sortedSprints.map((sprint, index) => {
                const users = usersBySprintMap[sprint] || [];

                // Sort users by name for consistent display
                const sortedUsers = [...users].sort((a, b) => a.userName.localeCompare(b.userName));

                return (
                    <View key={index} style={styles.teamSprintSection} wrap={false}>
                        <Text style={styles.teamSprintTitle}>{sprint}</Text>

                        {sortedUsers.length > 0 ? (
                            <View style={styles.teamMembersTable}>
                                {/* Table header */}
                                <View style={styles.teamMemberRow}>
                                    <Text style={[styles.teamMemberCell, styles.teamMemberHeader, { width: '30%' }]}>Team Member</Text>
                                    <Text style={[styles.teamMemberCell, styles.teamMemberHeader, { width: '25%' }]}>Completion</Text>
                                    <Text style={[styles.teamMemberCell, styles.teamMemberHeader, { width: '20%' }]}>Tasks</Text>
                                    <Text style={[styles.teamMemberCell, styles.teamMemberHeader, { width: '25%' }]}>Hours</Text>
                                </View>

                                {/* Table rows */}
                                {sortedUsers.map((user, userIndex) => (
                                    <View key={userIndex} style={styles.teamMemberRow}>
                                        <Text style={[styles.teamMemberCell, { width: '30%' }]}>{user.userName}</Text>
                                        <Text style={[styles.teamMemberCell, { width: '25%' }]}>
                                            <Text style={
                                                user.completionRate >= 75 ? styles.metricPositive :
                                                user.completionRate >= 50 ? styles.metricNeutral :
                                                styles.metricNegative
                                            }>
                                                {user.completionRate.toFixed(0)}%
                                            </Text>
                                        </Text>
                                        <Text style={[styles.teamMemberCell, { width: '20%' }]}>
                                            {user.completedTasks}/{user.assignedTasks}
                                        </Text>
                                        <Text style={[styles.teamMemberCell, { width: '25%' }]}>
                                            {user.totalRealHours}/{user.totalEstimatedHours}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>No team data available for this sprint</Text>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

// Executive Summary component
const ExecutiveSummary = ({ projectData, stats }) => {
    // Calculate project duration
    const startDate = projectData.length > 0 ? new Date(projectData[0].startDate) : new Date();
    const endDate = projectData.length > 0 ?
        new Date(projectData[projectData.length - 1].endDate || new Date()) :
        new Date();

    const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Calculate efficiency trend
    let efficiencyTrend = "stable";
    let efficiencyChange = 0;

    if (projectData.length >= 2) {
        const firstSprint = projectData[0];
        const lastSprint = projectData[projectData.length - 1];

        const firstEfficiency = firstSprint.totalEstimatedHours > 0 ?
            (firstSprint.hoursSpentOnCompleted / firstSprint.totalEstimatedHours) : 0;

        const lastEfficiency = lastSprint.totalEstimatedHours > 0 ?
            (lastSprint.hoursSpentOnCompleted / lastSprint.totalEstimatedHours) : 0;

        efficiencyChange = ((lastEfficiency - firstEfficiency) * 100).toFixed(1);

        if (efficiencyChange > 5) {
            efficiencyTrend = "improving";
        } else if (efficiencyChange < -5) {
            efficiencyTrend = "declining";
        }
    }

    return (
        <View style={styles.executiveSummaryContainer}>
            <Text style={styles.executiveSummaryTitle}>Executive Summary</Text>

            <View style={styles.executiveSummaryContent}>
                <Text style={styles.executiveSummaryText}>
                    This project spans <Text style={styles.highlightText}>{projectData.length} sprints</Text> over approximately <Text style={styles.highlightText}>{durationInDays} days</Text>, with an overall completion rate of <Text style={styles.highlightText}>{stats.completionRate}%</Text>.
                </Text>

                <Text style={styles.executiveSummaryText}>
                    Team efficiency is {efficiencyTrend}
                    {efficiencyChange !== 0 && (
                        <Text style={efficiencyChange > 0 ? styles.metricPositive : styles.metricNegative}>
                            {' '}{efficiencyChange > 0 ? '+' : ''}{efficiencyChange}%
                        </Text>
                    )} across sprints, with Sprint {stats.mostEfficientSprint.sprintNumber} being the most efficient at <Text style={styles.metricPositive}>{stats.mostEfficientSprint.efficiencyPercent}%</Text>.
                </Text>

                <Text style={styles.executiveSummaryText}>
                    The team has completed <Text style={styles.highlightText}>{stats.completedTasks} of {stats.totalTasks}</Text> tasks, with <Text style={styles.highlightText}>{stats.remainingTasks}</Text> tasks remaining.
                </Text>

                <Text style={styles.executiveSummaryText}>
                    Time estimation accuracy is at <Text style={styles.highlightText}>
                        {stats.totalEstimatedHours > 0 ? ((stats.totalRealHours/stats.totalEstimatedHours)*100).toFixed(1) : "0"}%
                    </Text> of the original estimate.
                </Text>
            </View>
        </View>
    );
};

const ProjectAnalyticsPDF = ({ insightsHtml, projectData, userPerformances }) => {
    const stats = calculateStats(projectData);
    // Prepare chart data but don't store in variable since it's not used directly
    prepareChartData(projectData);

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header with page number - only on first page */}
                <View style={styles.header}>
                    <Image
                        src="./assets/logo.png"
                        style={styles.logo}
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.title}>Sprint Analytics Report</Text>
                        <Text style={styles.subtitle}>Generated on {currentDate}</Text>
                    </View>
                </View>

                {/* Executive Summary */}
                <ExecutiveSummary projectData={projectData} stats={stats} />

                {/* Project Summary - Key metrics only */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryLabel}>TOTAL SPRINTS</Text>
                            <Text style={styles.summaryValue}>{projectData.length}</Text>
                        </View>
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryLabel}>COMPLETION RATE</Text>
                            <Text style={styles.summaryValue}>{stats.completionRate}%</Text>
                        </View>
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryLabel}>EFFICIENCY</Text>
                            <Text style={styles.summaryValue}>
                                {stats.totalEstimatedHours > 0 ?
                                    ((stats.hoursSpentOnCompleted / stats.totalEstimatedHours) * 100).toFixed(0) :
                                    "0"}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Hours Comparison with Chart */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Sprint Efficiency (Hours)</Text>
                    <Text style={styles.chartLabel}>Total Estimated Hours: <Text style={styles.chartValue}>{stats.totalEstimatedHours} hrs</Text></Text>
                    <Text style={styles.chartLabel}>Total Actual Hours: <Text style={styles.chartValue}>{stats.totalRealHours} hrs</Text></Text>
                    <Text style={styles.chartLabel}>
                        Difference:
                        <Text style={[styles.chartValue, styles.metricNegative]}>
                            {stats.totalRealHours > stats.totalEstimatedHours ? '+' : '-'}
                            {Math.abs(stats.totalEstimatedHours - stats.totalRealHours)} hrs
                        </Text>
                        ({stats.totalEstimatedHours > 0 ? ((stats.totalRealHours/stats.totalEstimatedHours)*100).toFixed(1) : "0"}% of estimate)
                    </Text>

                    {/* Bar chart visualizing hours by sprint */}
                    <HoursBarChart projectData={projectData} />
                </View>

                {/* Page number */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>

            {/* AI Insights Page */}
            <Page size="A4" style={styles.page} wrap={false}>
                <Text style={styles.sectionTitle}>AI-Generated Insights</Text>
                <Html
                    stylesheet={{
                        '.insightSection': styles.insightSection,
                        '.insightTitle': styles.insightTitle,
                        '.insightList': styles.insightList,
                        '.insightItem': styles.insightItem,
                        '.insightText': styles.insightText,
                        '.metricLabel': styles.metricLabel,
                        '.metricHighlight': styles.metricHighlight,
                        '.metricPositive': styles.metricPositive,
                        '.metricNegative': styles.metricNegative,
                        '.metricDetail': styles.metricDetail,
                        '.recommendationItem': styles.recommendationItem,
                        '.recommendationLabel': styles.recommendationLabel,
                    }}
                >
                    {insightsHtml}
                </Html>

                {/* Page number */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />

            </Page>

            {/* Team Performance Page (if data is available) */}
            {userPerformances && userPerformances.length > 0 && (
                <Page size="A4" style={styles.page} wrap={false}>
                    <TeamPerformanceSection userPerformances={userPerformances} />

                    {/* Page number */}
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />

                    {/* Footer */}
                    <Text style={styles.footer} fixed>
                        Confidential: This report is generated automatically and is intended for internal use only.
                        © {new Date().getFullYear()} Oracle Corporation. All rights reserved.
                    </Text>
                </Page>
            )}
        </Document>
    );
};

export const PDF = ProjectAnalyticsPDF;