import React from "react";
import OpenAi from "openai";
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

const client = new OpenAi({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const AICall = async (projectData) => {
    const response = await client.responses.create({
        model: "gpt-4.1",
        instructions,
        input: `Here is my project data in JSON: ${JSON.stringify(
            projectData,
            null,
            2
        )}. Please apply the instructions and extract key insights from this project.`,
    });
    return response.output_text;
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
                    <View style={[styles.barLegendColor, { backgroundColor: colors.secondaryBlue }]} />
                    <Text style={styles.barLegendText}>Estimated Hours</Text>
                </View>
                <View style={styles.barLegendItem}>
                    <View style={[styles.barLegendColor, { backgroundColor: colors.primaryBlue }]} />
                    <Text style={styles.barLegendText}>Actual Hours</Text>
                </View>
            </View>
        </View>
    );
};

const ProjectAnalyticsPDF = ({ insightsHtml, projectData }) => {
    const stats = calculateStats(projectData);
    const chartData = prepareChartData(projectData);

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image
                        src="./logo.png"
                        style={styles.logo}
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.title}>Sprint Analytics Report</Text>
                        <Text style={styles.subtitle}>Generated on {currentDate}</Text>
                    </View>
                </View>

                {/* Project Summary - SIMPLIFIED, removed project name box */}
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
                            <Text style={styles.summaryLabel}>TOTAL TASKS</Text>
                            <Text style={styles.summaryValue}>{stats.totalTasks}</Text>
                        </View>
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryLabel}>COMPLETED TASKS</Text>
                            <Text style={styles.summaryValue}>{stats.completedTasks}</Text>
                        </View>
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryLabel}>REMAINING TASKS</Text>
                            <Text style={styles.summaryValue}>{stats.remainingTasks}</Text>
                        </View>
                        <View style={styles.summaryBlock}>
                            {/* Intentionally left empty for balance */}
                        </View>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <Text style={styles.sectionTitle}>Overall Project Progress</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${stats.completionRate}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{stats.completionRate}% Complete</Text>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                {/* Hours Comparison with Chart */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Sprint Efficiency (Hours)</Text>
                    <Text style={styles.chartLabel}>Total Estimated Hours: <Text style={styles.chartValue}>{stats.totalEstimatedHours} hrs</Text></Text>
                    <Text style={styles.chartLabel}>Total Actual Hours: <Text style={styles.chartValue}>{stats.totalRealHours} hrs</Text></Text>
                    <Text style={styles.chartLabel}>
                        Difference:
                        <Text style={[styles.chartValue, styles.metricNegative]}>
                            -{stats.totalEstimatedHours - stats.totalRealHours} hrs
                        </Text>
                        ({stats.totalEstimatedHours > 0 ? ((stats.totalRealHours/stats.totalEstimatedHours)*100).toFixed(1) : "0"}% of estimate)
                    </Text>                    {/* Bar chart visualizing hours by sprint */}
                    <HoursBarChart projectData={projectData} />
                </View>

                {/* AI Insights */}
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

                {/* Footer */}
                <Text style={styles.footer}>
                    Confidential: This report is generated automatically and is intended for internal use only.
                    © {new Date().getFullYear()} Oracle Corporation. All rights reserved.
                </Text>
            </Page>
        </Document>
    );
};

export const PDF = ProjectAnalyticsPDF;