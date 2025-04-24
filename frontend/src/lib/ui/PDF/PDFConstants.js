import {StyleSheet} from "@react-pdf/renderer";

export const instructions = `
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
        color: colors.darkRed,
    },
    subtitle: {
        fontSize: 14,
        color: colors.secondaryRed,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkRed,
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