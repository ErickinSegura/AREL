import {StyleSheet} from "@react-pdf/renderer";

export const instructions = `
# Identity
You are a Project Analytics Assistant that generates structured HTML insights about sprint performance from JSON project data.

# Instructions
* Analyze the provided sprint data array and extract deep, actionable insights including:
  1. Project velocity and team capacity analysis across sprints.
  2. Overall completion rate with context on what it means for the project.
  3. Most and least efficient sprints with detailed analysis of potential causes.
  4. Estimation accuracy patterns and potential systemic issues in estimation.
  5. Identify problematic sprints (no progress, missing data, significant deviations).
  6. Detailed trend analysis showing patterns across sprints (improvement, decline, or volatility).
  7. Specific, actionable recommendations that address root causes, not just symptoms.

* Focus on providing high-value insights:
  - Identify patterns that might not be immediately obvious
  - Provide context for why metrics matter, not just what they are
  - Suggest concrete, specific actions the team can take to improve
  - Highlight both strengths to maintain and weaknesses to address
  - Consider team dynamics and potential process improvements
  - Analyze estimation patterns to improve future planning

* Output format:
  - Return structured HTML that will be integrated into a styled report
  - Format metrics and important values with appropriate classes
  - Structure recommendations in a visually distinct way
  - Use the following HTML structure exactly:

<div class="insightSection">
  <h3 class="insightTitle">Key Performance Analysis</h3>
  <ul class="insightList">
    <li class="insightItem">
      <span class="metricLabel">Most efficient sprint:</span>
      <span class="metricHighlight">Sprint #5</span>
      <span class="metricDetail">(44% efficiency rate)</span> - This sprint demonstrated optimal task allocation and realistic estimations.
    </li>
    <li class="insightItem">
      <span class="metricLabel">Least efficient sprint:</span>
      <span class="metricHighlight">Sprint #3</span>
      <span class="metricDetail">(28% efficiency rate)</span> - Likely caused by underestimation of task complexity and scope creep.
    </li>
    <!-- Additional detailed metrics with context -->
  </ul>
</div>

<div class="insightSection">
  <h3 class="insightTitle">Trend Analysis</h3>
  <p class="insightText">
    Efficiency <span class="metricPositive">improved by 23%</span> over the project lifecycle, with
    <span class="metricHighlight">Sprint #5</span> showing the greatest improvement. This indicates the team is
    adapting and refining their estimation process. The consistent upward trend suggests effective retrospectives
    and process improvements are being implemented between sprints.
  </p>
  <!-- Additional trend paragraphs with deep analysis -->
</div>

<div class="insightSection">
  <h3 class="insightTitle">Strategic Recommendations</h3>
  <ul class="insightList">
    <li class="insightItem recommendationItem">
      <span class="recommendationLabel">Estimation Refinement:</span>
      Adjust estimated hours by <span class="metricNegative">approximately 20%</span> for complex tasks.
      Consider implementing a complexity factor multiplier for tasks involving integration points or external dependencies.
    </li>
    <li class="insightItem recommendationItem">
      <span class="recommendationLabel">Process Improvement:</span>
      Implement mid-sprint check-ins to identify blocked tasks earlier, particularly for tasks with dependencies
      on external teams or systems. This could prevent the pattern of late-sprint delays observed in Sprints #2 and #4.
    </li>
    <!-- Additional specific, actionable recommendations -->
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
* Provide at least 3-4 detailed insights in each section.
* Focus on quality over quantity - each insight should be meaningful and actionable.
`;

export const colors = {
    primaryRed: '#C74634',        // Nuevo color principal (rojo)
    secondaryRed: '#E57373',      // Rojo más claro para etiquetas
    darkRed: '#8E2A22',           // Rojo oscuro para títulos
    lightRed: '#FFEBEE',          // Fondo rojo claro
    accentRed: '#B71C1C',         // Para métricas negativas
    accentGreen: '#2E7D32',       // Para métricas positivas (mantenido)
    grayText: '#757575',          // Para texto secundario (mantenido)
    grayLight: '#E0E0E0',         // Para bordes (mantenido)
    white: '#FFFFFF',             // Blanco (mantenido)
    background: '#FFF5F3'         // Fondo claro con un toque rojizo
};

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        padding: '30px 25px 50px 25px', // Top, right, bottom, left - increased bottom padding
        fontFamily: 'Helvetica',
        position: 'relative',
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
        color: colors.darkRed,
    },
    subtitle: {
        fontSize: 14,
        color: colors.secondaryRed,
        marginTop: 5,
    },
    // Executive Summary styles
    executiveSummaryContainer: {
        marginBottom: 25,
        padding: 15,
        borderWidth: 1,
        borderColor: colors.grayLight,
        borderRadius: 5,
        backgroundColor: colors.background,
    },
    executiveSummaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.darkRed,
        marginBottom: 10,
        textAlign: 'center',
    },
    executiveSummaryContent: {
        marginTop: 10,
    },
    executiveSummaryText: {
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 8,
        textAlign: 'justify',
    },
    highlightText: {
        fontWeight: 'bold',
        color: colors.darkRed,
    },
    // Team Performance styles
    teamPerformanceContainer: {
        marginTop: 20,
        marginBottom: 25,
        paddingBottom: 40, // Add padding to avoid footer overlap
    },
    teamSprintSection: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight,
        paddingBottom: 10,
    },
    teamSprintTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.darkRed,
        marginBottom: 10,
    },
    teamMembersTable: {
        width: '100%',
        marginBottom: 10,
    },
    teamMemberRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight,
        paddingVertical: 4,
    },
    teamMemberCell: {
        fontSize: 9,
        paddingHorizontal: 4,
    },
    teamMemberHeader: {
        fontWeight: 'bold',
        color: colors.darkRed,
        fontSize: 10,
        backgroundColor: colors.background,
    },
    metricNeutral: {
        fontWeight: 'bold',
        color: '#FFC107', // Amber color for neutral metrics
    },
    noDataText: {
        fontSize: 10,
        fontStyle: 'italic',
        color: colors.grayText,
        textAlign: 'center',
    },
    // Page number
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        fontSize: 10,
        color: colors.grayText,
    },
    // Original styles
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
        color: colors.secondaryRed,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.darkRed,
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkRed,
        marginBottom: 15,
        marginTop: 5,
    },
    progressContainer: {
        marginBottom: 25,
    },
    progressBarContainer: {
        height: 20,
        backgroundColor: colors.lightRed,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.primaryRed,
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
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.darkRed,
        marginBottom: 10,
    },
    chartLabel: {
        fontSize: 10,
        color: colors.grayText,
        marginBottom: 5,
    },
    chartValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.darkRed,
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
        height: 120, // Reduced height to fit better on page
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: colors.grayLight,
    },
    barContainer: {
        alignItems: 'center',
        width: '10%',
    },
    barEstimated: {
        backgroundColor: colors.secondaryRed,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        width: '60%',
    },
    barActual: {
        backgroundColor: colors.primaryRed,
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
        color: colors.darkRed,
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
        color: colors.darkRed,
        backgroundColor: colors.lightRed,
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
        backgroundColor: '#FFF0ED',
        borderRadius: 3,
    },
    recommendationLabel: {
        fontWeight: 'bold',
        color: '#C74634',
        display: 'block',
        marginBottom: 3,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 25,
        right: 25,
        fontSize: 8, // Smaller font size
        color: colors.grayText,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.grayLight,
        paddingTop: 5,
    },
});