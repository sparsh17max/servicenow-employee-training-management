/**
 * 12 — Reports for the "Training & Certification Overview" dashboard (Phase 4, Step 21)
 *
 * Run from Scripts - Background in the **app** scope. Idempotent (matched on title + table).
 * Creates five sys_report records:
 *   Enrolments by Status            course_enrollment        donut  group by enrollment_status
 *   Courses by Category             training_course          pie    group by category
 *   Session Distribution by Course  training_session         bar    group by course
 *   Certifications by Status        employee_certification   donut  group by certification_status
 *   Upcoming Training Sessions      training_session         list   start_date > now, not cancelled, by start_date
 *
 * The dashboard itself (Platform Analytics, Zurich) is built in the browser — see docs/manual-steps.md.
 */
(function () {
    var P = 'x_2186817_employ_0_';
    var reports = [
        { title: 'Enrolments by Status', table: P + 'course_enrollment', type: 'donut', field: 'enrollment_status', filter: '^GROUPBYenrollment_status' },
        { title: 'Courses by Category', table: P + 'training_course', type: 'pie', field: 'category', filter: '^GROUPBYcategory' },
        { title: 'Session Distribution by Course', table: P + 'training_session', type: 'bar', field: 'course', filter: '^GROUPBYcourse' },
        { title: 'Certifications by Status', table: P + 'employee_certification', type: 'donut', field: 'certification_status', filter: '^GROUPBYcertification_status' },
        { title: 'Upcoming Training Sessions', table: P + 'training_session', type: 'list', field: '',
          filter: 'start_date>javascript:gs.nowDateTime()^session_status!=cancelled^ORDERBYstart_date',
          field_list: 'session_name,course,start_date,end_date,delivery_mode,location,session_status,trainer', orderby: 'start_date', row_count: 20 }
    ];
    reports.forEach(function (r) {
        var gr = new GlideRecord('sys_report');
        gr.addQuery('title', r.title);
        gr.addQuery('table', r.table);
        gr.query();
        var isNew = !gr.next();
        if (isNew) gr.initialize();
        gr.setValue('title', r.title);
        gr.setValue('table', r.table);
        gr.setValue('type', r.type);
        gr.setValue('field', r.field);
        gr.setValue('filter', r.filter);
        gr.setValue('aggregate', 'COUNT');
        gr.setValue('chart_size', 'large');
        gr.setValue('show_chart_title', 'report');
        gr.setValue('chart_title_size', '16');
        gr.setValue('other_threshold', '-2');
        gr.setValue('display_grid', false);
        gr.setValue('is_published', false);
        gr.setValue('description', 'ETCMS dashboard report (Phase 4).');
        if (r.field_list) gr.setValue('field_list', r.field_list);
        if (r.orderby) gr.setValue('orderby', r.orderby);
        if (r.row_count) gr.setValue('row_count', r.row_count);
        var id = isNew ? gr.insert() : gr.update();
        gs.info('12-reports: ' + (isNew ? 'created ' : 'updated ') + r.title + ' (' + id + ')');
    });
})();
