import React from "react";
import OpenAi from "openai";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { Html } from 'react-pdf-html';
/* const client = new OpenAi({
  apiKey:
    "",
  dangerouslyAllowBrowser: true,
}); */

const instructions = `
# Identity
You are a Project Analytics Assistant that generates structured HTML insights about sprint performance from JSON project data.

# Instructions
* Analyze the provided sprint data array and extract:
  1. Project name and total number of sprints.  
  2. Overall completion rate: sum(completedTasks) / sum(totalTasks).  
  3. Most and least efficient sprint (based on hoursSpentOnCompleted vs totalEstimatedHours).  
  4. Estimation accuracy: compare totalRealHours vs totalEstimatedHours (absolute and percentage difference).  
  5. Identify sprints with no progress (totalTasks > 0 but completedTasks = 0) or missing data.  
  6. Trends across sprints (improvement or decline in efficiency).  
  7. Actionable recommendations to adjust future estimations and optimize workload.  

* Output format:
  - Return structured HTML that will be integrated into a styled report
  - Format metrics and important values with appropriate classes
  - Structure recommendations in a visually distinct way
  - Use the following HTML structure exactly:

<div class="insightSection">
  <h3 class="insightTitle">Key Performance Metrics</h3>
  <ul class="insightList">
    <li class="insightItem">
      <span class="metricLabel">Most efficient sprint:</span> 
      <span class="metricHighlight">Sprint #5</span> 
      <span class="metricDetail">(44% efficiency rate)</span>
    </li>
    <li class="insightItem">
      <span class="metricLabel">Least efficient sprint:</span> 
      <span class="metricHighlight">Sprint #3</span> 
      <span class="metricDetail">(28% efficiency rate)</span>
    </li>
    <!-- Additional metrics -->
  </ul>
</div>

<div class="insightSection">
  <h3 class="insightTitle">Trend Analysis</h3>
  <p class="insightText">
    Efficiency <span class="metricPositive">improved by 23%</span> over the project lifecycle, with 
    <span class="metricHighlight">Sprint #5</span> showing the greatest improvement.
  </p>
</div>

<div class="insightSection">
  <h3 class="insightTitle">Recommendations</h3>
  <ul class="insightList">
    <li class="insightItem recommendationItem">
      <span class="recommendationLabel">Estimation Adjustment:</span> 
      Reduce estimated hours by <span class="metricNegative">approximately 50%</span> in future sprints.
    </li>
    <!-- Additional recommendations -->
  </ul>
</div>

* Class usage:
  - metricPositive: For positive trends or improvements
  - metricNegative: For concerning metrics or areas needing attention
  - metricHighlight: For emphasizing important values
  - metricDetail: For additional context about a metric
  - metricLabel: For metric names
  - recommendationLabel: For labeling recommendation categories

* Do not include any markdown formatting, only the HTML requested.
* Do not add any styles, classes, or HTML structures not specified above.
`;

let projectData = [
  {
    projectName: "Quantum System Development",
    projectId: 2,
    sprintNumber: 1,
    startDate: "2025-05-01T09:00:00.000000",
    endDate: "2025-05-07T17:00:00.000000",
    totalTasks: 5,
    completedTasks: 3,
    hoursSpentOnCompleted: 10,
    totalEstimatedHours: 30,
    totalRealHours: 12,
  },
  {
    projectName: "Quantum System Development",
    projectId: 2,
    sprintNumber: 2,
    startDate: "2025-05-08T09:00:00.000000",
    endDate: "2025-05-14T17:00:00.000000",
    totalTasks: 8,
    completedTasks: 6,
    hoursSpentOnCompleted: 18,
    totalEstimatedHours: 40,
    totalRealHours: 22,
  },
  {
    projectName: "Quantum System Development",
    projectId: 2,
    sprintNumber: 3,
    startDate: "2025-05-15T09:00:00.000000",
    endDate: "2025-05-21T17:00:00.000000",
    totalTasks: 3,
    completedTasks: 1,
    hoursSpentOnCompleted: 5,
    totalEstimatedHours: 18,
    totalRealHours: 8,
  },
  {
    projectName: "Quantum System Development",
    projectId: 2,
    sprintNumber: 4,
    startDate: "2025-05-22T09:00:00.000000",
    endDate: "2025-05-28T17:00:00.000000",
    totalTasks: 6,
    completedTasks: 4,
    hoursSpentOnCompleted: 15,
    totalEstimatedHours: 35,
    totalRealHours: 16,
  },
  {
    projectName: "Quantum System Development",
    projectId: 2,
    sprintNumber: 5,
    startDate: "2025-05-29T09:00:00.000000",
    endDate: "2025-06-04T17:00:00.000000",
    totalTasks: 7,
    completedTasks: 7,
    hoursSpentOnCompleted: 20,
    totalEstimatedHours: 45,
    totalRealHours: 20,
  },
];

/* // Call OpenAI API
const response = await client.responses.create({
  model: "gpt-4.1",
  instructions,
  input: `Here is my project data in JSON (…): ${JSON.stringify(
    projectData,
    null,
    2
  )}. Please apply the instructions and extract key insights from this project.`,
});

console.log(response.output_text);
const insightsHtml = response.output_text; */

// Procesar datos para visualizaciones
const prepareChartData = (projectData) => {
    return projectData.map(sprint => ({
      name: `Sprint ${sprint.sprintNumber}`,
      Estimated: sprint.totalEstimatedHours,
      Actual: sprint.totalRealHours,
      Efficiency: parseFloat(((sprint.hoursSpentOnCompleted / sprint.totalEstimatedHours) * 100).toFixed(1))
    }));
  };
  
  const chartData = prepareChartData(projectData);
  
// Calcular estadísticas
const calculateStats = (projectData) => {
    const totalTasks = projectData.reduce((sum, sprint) => sum + sprint.totalTasks, 0);
    const completedTasks = projectData.reduce((sum, sprint) => sum + sprint.completedTasks, 0);
    const completionRate = (completedTasks / totalTasks * 100).toFixed(1);
    const totalEstimatedHours = projectData.reduce((sum, sprint) => sum + sprint.totalEstimatedHours, 0);
    const totalRealHours = projectData.reduce((sum, sprint) => sum + sprint.totalRealHours, 0);
    
    // Calcular eficiencia por sprint
    const sprintEfficiency = projectData.map(sprint => ({
      sprintNumber: sprint.sprintNumber,
      efficiency: sprint.hoursSpentOnCompleted / sprint.totalEstimatedHours,
      efficiencyPercent: ((sprint.hoursSpentOnCompleted / sprint.totalEstimatedHours) * 100).toFixed(0)
    }));
    
    // Encontrar sprint más y menos eficiente
    const mostEfficientSprint = [...sprintEfficiency].sort((a, b) => b.efficiency - a.efficiency)[0];
    const leastEfficientSprint = [...sprintEfficiency].sort((a, b) => a.efficiency - b.efficiency)[0];
    
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
  
  const stats = calculateStats(projectData);
  // Color palette based on your project
const colors = {
    primaryBlue: '#3F51B5',  // Matched from the progress bar in your PDF
    secondaryBlue: '#5C6BC0', // Lighter blue for labels
    darkBlue: '#1A237E',     // Dark blue for titles
    lightBlue: '#E8EAF6',    // Light blue background
    accentRed: '#D32F2F',    // For negative metrics
    accentGreen: '#2E7D32',  // For positive metrics
    grayText: '#757575',     // For secondary text
    grayLight: '#E0E0E0',    // For borders
    white: '#FFFFFF',
    background: '#F5F7FF'    // Light background color from your PDF
  };
// Create styles
const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: colors.white,
      padding: 30,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: colors.grayLight,
      paddingBottom: 20,
      width: '100%',
    },
    logo: {
      width: 80,
      height: 80,
      objectFit: 'cover',
    },
    headerText: {
      marginLeft: 20,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.darkBlue,
    },
    subtitle: {
      fontSize: 14,
      color: colors.secondaryBlue,
      marginTop: 5,
    },
    summaryContainer: {
      backgroundColor: colors.background,
      borderRadius: 5,
      marginBottom: 25,
      padding: 20,
      width: '100%',
    },
    summaryRow: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    summaryBlock: {
      flex: 1,
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.secondaryBlue,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    summaryValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.darkBlue,
      marginTop: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.darkBlue,
      marginBottom: 15,
      marginTop: 5,
    },
    progressContainer: {
      marginBottom: 25,
    },
    progressBarContainer: {
      height: 20,
      backgroundColor: colors.lightBlue,
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 10,
      marginBottom: 10,
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primaryBlue,
      borderRadius: 10,
    },
    progressText: {
      fontSize: 12,
      color: colors.grayText,
      textAlign: 'right',
    },
    chartContainer: {
      marginBottom: 30,
      padding: 10,
      borderWidth: 1, 
      borderColor: colors.grayLight,
      borderRadius: 5,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.darkBlue,
      marginBottom: 10,
    },
    chartLabel: {
      fontSize: 12,
      color: colors.grayText,
      marginBottom: 5,
    },
    chartValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.darkBlue,
    },
    sprintEfficiencyContainer: {
      marginBottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    sprintEfficiencyBlock: {
      width: '18%',
      marginBottom: 10,
      alignItems: 'center',
    },
    efficiencyCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    efficiencyValue: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.white,
    },
    sprintLabel: {
      fontSize: 10,
      textAlign: 'center',
      color: colors.grayText,
    },
    barChartContainer: {
      height: 150,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      marginTop: 20,
      paddingTop: 20,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: colors.grayLight,
    },
    barContainer: {
      alignItems: 'center',
      width: '10%',
    },
    barEstimated: {
      backgroundColor: colors.secondaryBlue,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      width: '60%',
    },
    barActual: {
      backgroundColor: colors.primaryBlue,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      width: '60%',
      marginLeft: 5,
    },
    barLabel: {
      fontSize: 8,
      marginTop: 5,
      textAlign: 'center',
      color: colors.grayText,
    },
    barLegendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    barLegendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    barLegendColor: {
      width: 12,
      height: 12,
      marginRight: 5,
    },
    barLegendText: {
      fontSize: 8,
      color: colors.grayText,
    },
    // HTML content styles
    insightSection: {
      marginBottom: 20,
      paddingTop: 15,
      paddingBottom: 15,
      borderTopWidth: 1,
      borderTopColor: colors.grayLight,
    },
    insightTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.darkBlue,
      marginBottom: 15,
    },
    insightList: {
      paddingLeft: 15,
      marginTop: 0,
      marginBottom: 10,
    },
    insightItem: {
      marginBottom: 8,
      fontSize: 12,
      lineHeight: 1.5,
    },
    insightText: {
      fontSize: 12,
      lineHeight: 1.5,
      marginBottom: 10,
    },
    metricLabel: {
      fontWeight: 'bold',
      color: colors.grayText,
    },
    metricHighlight: {
      fontWeight: 'bold',
      color: colors.darkBlue,
      backgroundColor: colors.lightBlue,
      padding: 2,
      borderRadius: 3,
    },
    metricPositive: {
      fontWeight: 'bold',
      color: colors.accentGreen,
    },
    metricNegative: {
      fontWeight: 'bold',
      color: colors.accentRed,
    },
    metricDetail: {
      fontSize: 11,
      color: colors.grayText,
      fontStyle: 'italic',
    },
    recommendationItem: {
      marginBottom: 10,
      padding: 5,
      backgroundColor: '#FFF8E1',
      borderRadius: 3,
    },
    recommendationLabel: {
      fontWeight: 'bold',
      color: '#F57F17',
      display: 'block',
      marginBottom: 3,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      fontSize: 10,
      color: colors.grayText,
      textAlign: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.grayLight,
      paddingTop: 10,
    },
  });

// Componente para visualizar la eficiencia de los sprints
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

  // Componente para el gráfico de barras
const HoursBarChart = ({ projectData }) => {
    // Encuentra el valor máximo para escalar las barras
    const maxEstimatedHours = Math.max(...projectData.map(sprint => sprint.totalEstimatedHours));
    
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
        
        {/* Leyenda */}
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

  // Mock AI response HTML para demostración
  const mockAiResponse = `
  <div class="insightSection">
    <h3 class="insightTitle">Key Performance Metrics</h3>
    <ul class="insightList">
      <li class="insightItem">
        <span class="metricLabel">Most efficient sprint:</span> 
        <span class="metricHighlight">Sprint #5</span> 
        <span class="metricDetail">(44% efficiency rate)</span>
      </li>
      <li class="insightItem">
        <span class="metricLabel">Least efficient sprint:</span> 
        <span class="metricHighlight">Sprint #3</span> 
        <span class="metricDetail">(28% efficiency rate)</span>
      </li>
      <li class="insightItem">
        <span class="metricLabel">Estimation accuracy:</span> 
        <span class="metricNegative">53.6% below estimate</span> 
        <span class="metricDetail">(168 estimated vs 78 actual hours)</span>
      </li>
    </ul>
  </div>
  
  <div class="insightSection">
    <h3 class="insightTitle">Trend Analysis</h3>
    <p class="insightText">
      Efficiency <span class="metricPositive">improved significantly</span> in the final sprint, with a generally 
      upward trend following a dip in sprint 3. Sprint 5 achieved <span class="metricHighlight">100% task completion</span> 
      and the highest efficiency ratio.
    </p>
  </div>
  
  <div class="insightSection">
    <h3 class="insightTitle">Recommendations</h3>
    <ul class="insightList">
      <li class="insightItem recommendationItem">
        <span class="recommendationLabel">Estimation Adjustment:</span> 
        Reduce estimated hours by <span class="metricNegative">approximately 50%</span> in future sprints to align with actual velocity and historical delivery rates.
      </li>
      <li class="insightItem recommendationItem">
        <span class="recommendationLabel">Process Improvement:</span> 
        Review and refine estimation methods, especially for complex sprints, as actuals are <span class="metricNegative">consistently lower</span> than estimates.
      </li>
      <li class="insightItem recommendationItem">
        <span class="recommendationLabel">Success Replication:</span> 
        Continue leveraging what worked in <span class="metricHighlight">Sprint #5</span>—analyze practices that led to full task completion and higher efficiency to replicate in future cycles.
      </li>
    </ul>
  </div>
  `;

  // Componente principal del documento PDF
// Componente principal del documento PDF
const ProjectAnalyticsPDF = () => {
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
              src="/logo.png"
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
          
          {/* Sprint Efficiency Visualization */}
          <View style={styles.progressContainer}>
            <Text style={styles.sectionTitle}>Sprint Efficiency</Text>
            <SprintEfficiencyVisual sprintEfficiency={stats.sprintEfficiency} />
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
            {/* Hours Comparison with Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Sprint Efficiency (Hours)</Text>
            <Text style={styles.chartLabel}>Total Estimated Hours: <Text style={styles.chartValue}>{stats.totalEstimatedHours} hrs</Text></Text>
            <Text style={styles.chartLabel}>Total Actual Hours: <Text style={styles.chartValue}>{stats.totalRealHours} hrs</Text></Text>
            <Text style={styles.chartLabel}>Difference: <Text style={[styles.chartValue, styles.metricNegative]}>-{stats.totalEstimatedHours - stats.totalRealHours} hrs</Text> ({((stats.totalRealHours/stats.totalEstimatedHours)*100).toFixed(1)}% of estimate)</Text>
            
            {/* Bar chart visualizing hours by sprint */}
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
            {mockAiResponse}
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