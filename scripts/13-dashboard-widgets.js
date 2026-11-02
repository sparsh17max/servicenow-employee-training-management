/**
 * 13 — Platform Analytics dashboard "Training & Certification Overview" (Phase 4, Step 24)
 *
 * Run from Scripts - Background in the **app** scope. Idempotent (matched on dashboard name / widget name).
 * Zurich stores dashboards as Platform Analytics records, not pa_dashboards:
 *   par_dashboard  ->  par_dashboard_tab  ->  par_dashboard_canvas (layout JSON)  ->  par_dashboard_widget
 * Each widget is a sys_ux_macroponent (Donut / Pie / Vertical bar / List - Simple) plus a component_props JSON
 * whose dataSources/groupBy/metrics describe the same query as the sys_report records from script 12.
 * The canvas "layout" column must list the same widgets (sys_id, x, y, w, h, component_id, component_props)
 * or the page renders empty. Sharing = par_dashboard_permission (group Training Managers, can_read).
 *
 * The component_props below were taken from the working dashboard (built 2026-11-02) so the chart options
 * match what the in-line editor would generate. Grid is 48 columns wide.
 */
(function () {
    var DASH_NAME = 'Training & Certification Overview';
    var DASH_DESC = 'ETCMS overview: enrolments, courses, sessions and certifications';
    var GROUP = 'Training Managers';
    var widgets = [
        { name: "Enrolments by Status", component: 'a2b0596cec6b9d49dd1ff9bf76b5084b', x: 0, y: 0, w: 24, h: 14,
          props: "{\"filterConfigurations\":[],\"selectedElements\":[],\"showDataLabels\":true,\"dataLabelsType\":\"value\",\"truncationType\":\"end\",\"showRegister\":true,\"registerPosition\":\"bottom\",\"registerOrientation\":\"horizontal\",\"showRegisterOnSameLine\":false,\"showRegisterValue\":false,\"legendHorizontalAlignment\":\"center\",\"legendExpandToFit\":false,\"showRegisterPercentage\":false,\"newReporting\":false,\"additionalGroupByConfig\":[],\"showHeader\":true,\"showTotalAggregate\":false,\"showSubAggregate\":false,\"showFirstGroupAggregate\":false,\"showSecondGroupAggregate\":false,\"hideMatrixAggregate\":false,\"wrapTitle\":false,\"showHeaderSeparator\":false,\"headingLevel\":2,\"showBorder\":true,\"bareBorder\":false,\"telemetry\":null,\"showDataPassthrough\":false,\"showAdditionalGroupBySelector\":false,\"dataPassthrough\":null,\"sortByOrder\":\"desc\",\"showChange\":false,\"showChangePercentage\":false,\"showTarget\":false,\"showForecast\":false,\"showForecastRange\":false,\"showTrend\":false,\"showConfidenceBand\":false,\"showGapPercentage\":false,\"showSparkline\":false,\"showMetricLabel\":false,\"showThreshold\":false,\"showComment\":false,\"followFilters\":true,\"showFilterIcon\":false,\"enableRealTimeUpdate\":false,\"enableDrilldown\":true,\"enableClickAndStay\":false,\"enableCustomEmptyState\":false,\"emptyStateIllustration\":\"no-data\",\"emptyStateHeading\":\"No data available.\",\"emptyStateContent\":\"There are no scores available for the selected criteria. Contact your admin for more info.\",\"emptyStateAlignment\":\"vertical-centered\",\"hideDevSettings\":false,\"contextMenuActions\":[],\"showMaximumRange\":false,\"allowChangeDateRange\":false,\"showDateRangeByDefault\":false,\"applyDateRange\":false,\"numberOfPeriods\":3,\"showAbsolutePeriod\":false,\"scoreType\":null,\"showChangeFrom\":\"previous\",\"period\":\"M\",\"dateFormat\":\"default\",\"description\":\"\",\"configVersion\":\"23.0.0-ci-SNAPSHOT\",\"sortBy\":\"value\",\"showTotalValue\":true,\"colorConfig\":{\"type\":\"chartColor\"},\"headerTitle\":\"Enrolments by Status\",\"dataSources\":[{\"isDatabaseView\":false,\"allowRealTime\":true,\"label\":\"Course Enrollment\",\"sourceType\":\"table\",\"tableOrViewName\":\"x_2186817_employ_0_course_enrollment\",\"filterQuery\":\"\",\"id\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfY291cnNlX2Vucm9sbG1lbnQxNzkzNjA5Mjc5MjU0\",\"dataCategories\":[\"trend\",\"group\",\"simple\"]}],\"groupBy\":[{\"groupBy\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfY291cnNlX2Vucm9sbG1lbnQxNzkzNjA5Mjc5MjU0\",\"groupByField\":\"enrollment_status\",\"isRange\":false,\"isChoice\":true,\"isPaBucket\":false}],\"maxNumberOfGroups\":10,\"numberOfGroupsBasedOn\":\"NO_OF_GROUP_BASED_ON_PER_METRIC\",\"showOthers\":false,\"disableRanges\":false}],\"metrics\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfY291cnNlX2Vucm9sbG1lbnQxNzkzNjA5Mjc5MjU0\",\"id\":\"ZEdGaWJHVjRYekl4T0RZNE1UZGZaVzF3Ykc5NVh6QmZZMjkxY25ObFgyVnVjbTlzYkcxbGJuUXhOemt6TmpBNU1qYzVNalUwMTc5MzYwOTI3OTI1NA==\",\"aggregateFunction\":\"COUNT\",\"numberFormat\":{\"customFormat\":false},\"axisId\":\"primary\"}],\"showLegend\":true}" },
        { name: "Courses by Category", component: '96abe7e38d8790718022c5630a92176c', x: 24, y: 0, w: 24, h: 14,
          props: "{\"configVersion\":\"22.1.5\",\"showDataLabels\":true,\"dataLabelsType\":\"value\",\"truncationType\":\"end\",\"showRegister\":true,\"registerPosition\":\"bottom\",\"registerOrientation\":\"horizontal\",\"showRegisterOnSameLine\":false,\"showRegisterValue\":false,\"legendHorizontalAlignment\":\"center\",\"legendExpandToFit\":false,\"showRegisterPercentage\":false,\"colorConfig\":{\"type\":\"default\"},\"dataSources\":[{\"isDatabaseView\":false,\"allowRealTime\":true,\"label\":\"Training Course\",\"sourceType\":\"table\",\"tableOrViewName\":\"x_2186817_employ_0_training_course\",\"filterQuery\":\"\",\"id\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfdHJhaW5pbmdfY291cnNlMTc5MzYwOTI3OTI1NQ==\",\"dataCategories\":[\"trend\",\"group\",\"simple\"]}],\"showHeader\":true,\"showTotalAggregate\":false,\"showSubAggregate\":false,\"showFirstGroupAggregate\":false,\"showSecondGroupAggregate\":false,\"wrapTitle\":false,\"showHeaderSeparator\":false,\"headerTitle\":\"Courses by Category\",\"showBorder\":true,\"bareBorder\":false,\"showDataPassthrough\":false,\"dataPassthrough\":null,\"metrics\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfdHJhaW5pbmdfY291cnNlMTc5MzYwOTI3OTI1NQ==\",\"id\":\"ZEdGaWJHVjRYekl4T0RZNE1UZGZaVzF3Ykc5NVh6QmZkSEpoYVc1cGJtZGZZMjkxY25ObE1UYzVNell3T1RJM09USTFOUT09MTc5MzYwOTI3OTI1NQ==\",\"aggregateFunction\":\"COUNT\",\"numberFormat\":{\"customFormat\":false},\"axisId\":\"primary\"}],\"groupBy\":[{\"groupBy\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfdHJhaW5pbmdfY291cnNlMTc5MzYwOTI3OTI1NQ==\",\"groupByField\":\"category\",\"isRange\":false,\"isChoice\":true,\"isPaBucket\":false}],\"maxNumberOfGroups\":10,\"numberOfGroupsBasedOn\":\"NO_OF_GROUP_BASED_ON_PER_METRIC\",\"showOthers\":false,\"disableRanges\":false}],\"sortBy\":\"value\",\"sortByOrder\":\"desc\",\"trendBy\":null,\"showChange\":false,\"showChangePercentage\":false,\"showTarget\":false,\"showForecast\":false,\"showForecastRange\":false,\"showTrend\":false,\"showConfidenceBand\":false,\"showGapPercentage\":false,\"showSparkline\":false,\"showMetricLabel\":false,\"showThreshold\":false,\"showComment\":false,\"followFilters\":true,\"showFilterIcon\":true,\"enableRealTimeUpdate\":false,\"enableDrilldown\":true,\"filterConfigurations\":[],\"showMaximumRange\":false,\"applyDateRange\":false,\"numberOfPeriods\":3,\"showAbsolutePeriod\":false,\"scoreType\":null,\"showChangeFrom\":\"previous\",\"period\":\"M\",\"dateFormat\":\"default\",\"showLegend\":true}" },
        { name: "Session Distribution by Course", component: '23051643b7e03010097cb81cde11a910', x: 0, y: 14, w: 24, h: 14,
          props: "{\"configVersion\":\"23.0.0-ci-SNAPSHOT\",\"yAxisHidden\":false,\"yAxisPosition\":\"bottom\",\"yAxisShowGrid\":true,\"xAxisWrapLabels\":false,\"xAxisMaxLabelSize\":100,\"xAxisTruncationType\":\"end\",\"yAxisStyle\":\"clean\",\"showLegend\":true,\"showLegendValue\":false,\"legendPosition\":\"bottom\",\"legendHorizontalAlignment\":\"center\",\"legendExpandToFit\":false,\"showDataLabels\":true,\"dataLabelPosition\":\"middle\",\"showStackedValues\":\"none\",\"showOverlappingLabels\":false,\"colorConfig\":{\"type\":\"default\"},\"newReporting\":false,\"dataSources\":[{\"isDatabaseView\":false,\"allowRealTime\":true,\"label\":\"Training Session\",\"sourceType\":\"table\",\"tableOrViewName\":\"x_2186817_employ_0_training_session\",\"filterQuery\":\"\",\"id\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfdHJhaW5pbmdfc2Vzc2lvbjE3OTM2MDkyNzkyNTU=\",\"dataCategories\":[\"trend\",\"group\",\"simple\"]}],\"showHeader\":true,\"showTotalAggregate\":false,\"showSubAggregate\":false,\"showFirstGroupAggregate\":false,\"showSecondGroupAggregate\":false,\"hideMatrixAggregate\":false,\"wrapTitle\":false,\"showHeaderSeparator\":false,\"headerTitle\":\"Session Distribution by Course\",\"showBorder\":true,\"bareBorder\":false,\"telemetry\":\"null\",\"showDataPassthrough\":false,\"dataPassthrough\":null,\"metrics\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfdHJhaW5pbmdfc2Vzc2lvbjE3OTM2MDkyNzkyNTU=\",\"id\":\"ZEdGaWJHVjRYekl4T0RZNE1UZGZaVzF3Ykc5NVh6QmZkSEpoYVc1cGJtZGZjMlZ6YzJsdmJqRTNPVE0yTURreU56a3lOVFU9MTc5MzYwOTI3OTI1NQ==\",\"aggregateFunction\":\"COUNT\",\"numberFormat\":{\"customFormat\":false},\"axisId\":\"primary\"}],\"groupBy\":[{\"groupBy\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfdHJhaW5pbmdfc2Vzc2lvbjE3OTM2MDkyNzkyNTU=\",\"groupByField\":\"course\",\"isRange\":false,\"isChoice\":false,\"isPaBucket\":false}],\"maxNumberOfGroups\":10,\"numberOfGroupsBasedOn\":\"NO_OF_GROUP_BASED_ON_PER_METRIC\",\"showOthers\":false,\"disableRanges\":false}],\"sortBy\":\"value\",\"sortByOrder\":\"desc\",\"trendBy\":null,\"showChange\":false,\"showChangePercentage\":false,\"showTarget\":false,\"showForecast\":false,\"showForecastRange\":false,\"showTrend\":false,\"showConfidenceBand\":false,\"showGapPercentage\":false,\"showSparkline\":false,\"showMetricLabel\":false,\"showThreshold\":false,\"showComment\":false,\"followFilters\":true,\"showFilterIcon\":true,\"enableRealTimeUpdate\":false,\"enableDrilldown\":true,\"enableCustomEmptyState\":false,\"emptyStateIllustration\":\"no-data\",\"emptyStateHeading\":\"No data available.\",\"emptyStateContent\":\"There are no scores available for the selected criteria. Contact your admin for more info.\",\"emptyStateAlignment\":\"vertical-centered\",\"showMaximumRange\":false,\"applyDateRange\":false,\"numberOfPeriods\":3,\"showAbsolutePeriod\":false,\"scoreType\":null,\"showChangeFrom\":\"previous\",\"period\":\"M\",\"dateFormat\":\"default\",\"yAxisTitle\":\"\",\"xAxisTitle\":\"\",\"yAxisFrom\":\"\",\"yAxisTo\":\"\",\"chartVariation\":\"grouped\",\"noDebounce\":\"\",\"showDateRangeByDefault\":false,\"allowChangeDateRange\":false,\"dataLabelsType\":\"value\",\"showRegister\":true}" },
        { name: "Certifications by Status", component: 'a2b0596cec6b9d49dd1ff9bf76b5084b', x: 24, y: 14, w: 24, h: 14,
          props: "{\"filterConfigurations\":[],\"selectedElements\":[],\"showDataLabels\":true,\"dataLabelsType\":\"value\",\"truncationType\":\"end\",\"showRegister\":true,\"registerPosition\":\"bottom\",\"registerOrientation\":\"horizontal\",\"showRegisterOnSameLine\":false,\"showRegisterValue\":false,\"legendHorizontalAlignment\":\"center\",\"legendExpandToFit\":false,\"showRegisterPercentage\":false,\"newReporting\":false,\"additionalGroupByConfig\":[],\"showHeader\":true,\"showTotalAggregate\":false,\"showSubAggregate\":false,\"showFirstGroupAggregate\":false,\"showSecondGroupAggregate\":false,\"hideMatrixAggregate\":false,\"wrapTitle\":false,\"showHeaderSeparator\":false,\"headingLevel\":2,\"showBorder\":true,\"bareBorder\":false,\"telemetry\":null,\"showDataPassthrough\":false,\"showAdditionalGroupBySelector\":false,\"dataPassthrough\":null,\"sortByOrder\":\"desc\",\"showChange\":false,\"showChangePercentage\":false,\"showTarget\":false,\"showForecast\":false,\"showForecastRange\":false,\"showTrend\":false,\"showConfidenceBand\":false,\"showGapPercentage\":false,\"showSparkline\":false,\"showMetricLabel\":false,\"showThreshold\":false,\"showComment\":false,\"followFilters\":true,\"showFilterIcon\":false,\"enableRealTimeUpdate\":false,\"enableDrilldown\":true,\"enableClickAndStay\":false,\"enableCustomEmptyState\":false,\"emptyStateIllustration\":\"no-data\",\"emptyStateHeading\":\"No data available.\",\"emptyStateContent\":\"There are no scores available for the selected criteria. Contact your admin for more info.\",\"emptyStateAlignment\":\"vertical-centered\",\"hideDevSettings\":false,\"contextMenuActions\":[],\"showMaximumRange\":false,\"allowChangeDateRange\":false,\"showDateRangeByDefault\":false,\"applyDateRange\":false,\"numberOfPeriods\":3,\"showAbsolutePeriod\":false,\"scoreType\":null,\"showChangeFrom\":\"previous\",\"period\":\"M\",\"dateFormat\":\"default\",\"description\":\"\",\"configVersion\":\"23.0.0-ci-SNAPSHOT\",\"sortBy\":\"value\",\"showTotalValue\":true,\"colorConfig\":{\"type\":\"chartColor\"},\"headerTitle\":\"Certifications by Status\",\"dataSources\":[{\"isDatabaseView\":false,\"allowRealTime\":true,\"label\":\"Employee Certification\",\"sourceType\":\"table\",\"tableOrViewName\":\"x_2186817_employ_0_employee_certification\",\"filterQuery\":\"\",\"id\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfZW1wbG95ZWVfY2VydGlmaWNhdGlvbjE3OTM2MDkyNzkyNTU=\",\"dataCategories\":[\"trend\",\"group\",\"simple\"]}],\"groupBy\":[{\"groupBy\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfZW1wbG95ZWVfY2VydGlmaWNhdGlvbjE3OTM2MDkyNzkyNTU=\",\"groupByField\":\"certification_status\",\"isRange\":false,\"isChoice\":true,\"isPaBucket\":false}],\"maxNumberOfGroups\":10,\"numberOfGroupsBasedOn\":\"NO_OF_GROUP_BASED_ON_PER_METRIC\",\"showOthers\":false,\"disableRanges\":false}],\"metrics\":[{\"dataSource\":\"dGFibGV4XzIxODY4MTdfZW1wbG95XzBfZW1wbG95ZWVfY2VydGlmaWNhdGlvbjE3OTM2MDkyNzkyNTU=\",\"id\":\"ZEdGaWJHVjRYekl4T0RZNE1UZGZaVzF3Ykc5NVh6QmZaVzF3Ykc5NVpXVmZZMlZ5ZEdsbWFXTmhkR2x2YmpFM09UTTJNRGt5TnpreU5UVT0xNzkzNjA5Mjc5MjU1\",\"aggregateFunction\":\"COUNT\",\"numberFormat\":{\"customFormat\":false},\"axisId\":\"primary\"}],\"showLegend\":true}" },
        { name: "Upcoming Training Sessions", component: '2b1c080881e05dc63b917044290b233f', x: 0, y: 28, w: 48, h: 14,
          props: "{\"table\":\"x_2186817_employ_0_training_session\",\"columnPreferenceKey\":\"\",\"fixedQuery\":\"\",\"followFilters\":true,\"listTitle\":\"Upcoming Training Sessions\",\"columns\":\"session_name,course,start_date,end_date,delivery_mode,location,session_status,trainer\",\"query\":\"start_date>javascript:gs.nowDateTime()^session_status!=cancelled^ORDERBYstart_date\",\"groupByField\":\"\",\"hideViewAll\":false,\"hideHighlightedValues\":false,\"showBorder\":true,\"bare\":false,\"highlightedValueConfigId\":\"\",\"hideHighlightContent\":false,\"highlightContent\":{\"patterns\":[],\"color\":\"\"},\"hideLinks\":false,\"nrlLandmark\":true,\"wordWrap\":false,\"overrideWordWrapUserPref\":false,\"maxCharLimit\":4000,\"hideEmptyStateImage\":false,\"hidePersonalization\":true,\"hideDotwalk\":false,\"hideColumnReorder\":false,\"hideRowSelector\":false,\"hideColumnGrouping\":false,\"hideColumnResizing\":false,\"hideColumnFiltering\":false,\"hideColumnSorting\":false,\"hideHeader\":false,\"hideTitle\":false,\"hideTitleRowCount\":false,\"hideLastRefreshedText\":true,\"hideRefreshButton\":true,\"hideInlineEditing\":true,\"isDashboard\":true,\"id\":\"hideLastRefreshedText\",\"value\":true,\"propLabel\":\"Hide last refresh information\",\"noDebounce\":true,\"maxColumns\":8}" },
    ];

    // 1. dashboard
    var d = new GlideRecord('par_dashboard');
    d.addQuery('name', DASH_NAME);
    d.query();
    if (!d.next()) {
        d.initialize();
        d.setValue('name', DASH_NAME);
        d.setValue('description', DASH_DESC);
        d.setValue('active', true);
        d.setValue('grid', 48);
        d.insert();
        gs.info('13-dashboard: created dashboard ' + d.getUniqueValue());
    }
    var dashId = d.getUniqueValue();

    // 2. tab
    var t = new GlideRecord('par_dashboard_tab');
    t.addQuery('dashboard', dashId);
    t.orderBy('order');
    t.query();
    if (!t.next()) {
        t.initialize();
        t.setValue('dashboard', dashId);
        t.setValue('name', 'Overview');
        t.setValue('order', 0);
        t.setValue('active', true);
        t.insert();
    } else if (t.getValue('name') != 'Overview') {
        t.setValue('name', 'Overview');
        t.update();
    }
    var tabId = t.getUniqueValue();

    // 3. canvas for the tab
    var c = new GlideRecord('par_dashboard_canvas');
    c.addQuery('dashboard', dashId);
    c.addQuery('dashboard_tab', tabId);
    c.query();
    if (!c.next()) {
        c.initialize();
        c.setValue('dashboard', dashId);
        c.setValue('dashboard_tab', tabId);
        c.setValue('layout', '[]');
        c.insert();
    }
    var canvasId = c.getUniqueValue();

    // 4. widgets + layout
    var layout = [];
    widgets.forEach(function (w) {
        var g = new GlideRecord('par_dashboard_widget');
        g.addQuery('canvas', canvasId);
        g.addQuery('name', w.name);
        g.query();
        var isNew = !g.next();
        if (isNew) g.initialize();
        g.setValue('canvas', canvasId);
        g.setValue('name', w.name);
        g.setValue('component', w.component);
        g.setValue('x', w.x); g.setValue('y', w.y); g.setValue('w', w.w); g.setValue('h', w.h);
        g.setValue('component_props', w.props);
        var id = isNew ? g.insert() : g.update();
        layout.push({ sys_id: id, x: w.x, y: w.y, w: w.w, h: w.h, name: w.name, component_id: w.component, component_props: w.props });
        gs.info('13-dashboard: ' + (isNew ? 'created ' : 'updated ') + w.name + ' (' + id + ')');
    });
    c.setValue('layout', JSON.stringify(layout));
    c.update();

    // 5. share with Training Managers (read)
    var grp = new GlideRecord('sys_user_group');
    if (grp.get('name', GROUP)) {
        var p = new GlideRecord('par_dashboard_permission');
        p.addQuery('dashboard', dashId);
        p.addQuery('group', grp.getUniqueValue());
        p.query();
        if (!p.next()) {
            p.initialize();
            p.setValue('dashboard', dashId);
            p.setValue('group', grp.getUniqueValue());
            p.setValue('can_read', true);
            p.setValue('can_write', false);
            p.setValue('can_share', false);
            p.setValue('owner', false);
            p.insert();
            gs.info('13-dashboard: shared with ' + GROUP);
        }
    }
    gs.info('13-dashboard: done — open /now/platform-analytics-workspace/dashboards/params/edit/false/sys-id/' + dashId);
})();
