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
        <View style={styles.teamPerformanceContainer}>
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

// Get current date for report
const currentDate = new Date().toLocaleDateString();

const ProjectAnalyticsPDF = ({ insightsHtml, projectData, userPerformances }) => {
    return (
        <Document>
            {/* AI Insights Page */}
            <Page size="A4" style={styles.page} wrap={false}>
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
                <Text style={styles.sectionTitle}>AI-Generated Insights</Text>
                <View style={{ paddingBottom: 40 }}>
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
                </View>

                {/* Page number */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>

            {/* Team Performance Page (if data is available) */}
            {userPerformances && userPerformances.length > 0 && (
                <Page size="A4" style={styles.page} wrap={false}>
                    <Text style={styles.sectionTitle}>Team Performance</Text>
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