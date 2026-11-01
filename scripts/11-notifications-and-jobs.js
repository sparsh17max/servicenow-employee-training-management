/**
 * 11 — Notifications, events and daily reminder jobs (Phase 4, Step 20)
 *
 * Run from Scripts - Background in the **app** scope (x_2186817_employ_0). Idempotent.
 * Creates:
 *   - Group "Training Managers" (fallback approvers for the enrolment approval flow)
 *   - Events  x_2186817_employ_0.session.reminder (Course Enrollment)
 *             x_2186817_employ_0.cert.expiring   (Employee Certification)   <- event names max 40 chars
 *   - Notifications (sysevent_email_action)
 *       Enrolment approved          record-based, Enrollment Status changes to Enrolled   -> employee
 *       Enrolment rejected          record-based, Enrollment Status changes to Cancelled  -> employee
 *       Upcoming session reminder   event-based  (generation_type = event)               -> employee
 *       Certification expiry reminder event-based (generation_type = event)              -> employee
 *   - Scheduled Script Executions (sysauto_script), daily
 *       ETCMS - Upcoming session reminders      06:00  sessions starting within 3 days -> event per enrolled employee
 *       ETCMS - Certification expiry reminders  06:15  expiry within 30 days, status != expired -> event; Active -> Renewal Pending
 *
 * Gotchas learned: "Send when" is the field generation_type ('engine' = record inserted/updated, 'event' = event is fired);
 * the Table API default is 'engine', so event notifications created by API never fire until this is set.
 */
(function () {
    var ENR = 'x_2186817_employ_0_course_enrollment';
    var CERT = 'x_2186817_employ_0_employee_certification';
    var FOOTER = '<p style="color:#64748b;font-size:12px">Novatrix Solutions &middot; Employee Training &amp; Certification Management. This is an automated message.</p>';

    function upsert(table, keys, values) {
        var gr = new GlideRecord(table);
        for (var k in keys) gr.addQuery(k, keys[k]);
        gr.query();
        var isNew = !gr.next();
        if (isNew) { gr.initialize(); for (var k2 in keys) gr.setValue(k2, keys[k2]); }
        for (var v in values) gr.setValue(v, values[v]);
        var id = isNew ? gr.insert() : gr.update();
        gs.info('11: ' + (isNew ? 'created ' : 'updated ') + table + ' ' + JSON.stringify(keys));
        return id;
    }

    // Group
    upsert('sys_user_group', { name: 'Training Managers' }, {
        description: 'Novatrix training managers: fallback approvers for course enrolment requests and owners of training sessions.',
        active: true
    });

    // Events
    upsert('sysevent_register', { event_name: 'x_2186817_employ_0.session.reminder' }, {
        table: ENR,
        description: "Fired by the daily 'ETCMS - Upcoming session reminders' job for each enrolled employee whose session starts within 3 days. parm1 = session start (display), parm2 = session name.",
        fired_by: 'Scheduled job: ETCMS - Upcoming session reminders'
    });
    upsert('sysevent_register', { event_name: 'x_2186817_employ_0.cert.expiring' }, {
        table: CERT,
        description: "Fired by the daily 'ETCMS - Certification expiry reminders' job for certifications expiring within 30 days (status not Expired). parm1 = expiry date (display).",
        fired_by: 'Scheduled job: ETCMS - Certification expiry reminders'
    });

    // Notifications
    var sessionTable = '<table style="border-collapse:collapse">' +
        '<tr><td style="padding:2px 12px 2px 0"><b>Enrolment</b></td><td>${number}</td></tr>' +
        '<tr><td style="padding:2px 12px 2px 0"><b>Ends</b></td><td>${training_session.end_date}</td></tr>' +
        '<tr><td style="padding:2px 12px 2px 0"><b>Delivery</b></td><td>${training_session.delivery_mode} ${training_session.location}</td></tr>' +
        '<tr><td style="padding:2px 12px 2px 0"><b>Trainer</b></td><td>${training_session.trainer}</td></tr></table>';

    upsert('sysevent_email_action', { collection: ENR, name: 'Enrolment approved' }, {
        generation_type: 'engine', action_insert: false, action_update: true,
        condition: 'enrollment_statusCHANGESTOenrolled', recipient_fields: 'employee', content_type: 'text/html', active: true,
        subject: 'Enrolment ${number} approved: ${training_session.session_name}',
        message_html: '<p>Hi ${employee.first_name},</p><p>Your request to attend <strong>${training_session.session_name}</strong> (${training_session.course}) has been <strong>approved</strong>.</p>' +
            '<table style="border-collapse:collapse"><tr><td style="padding:2px 12px 2px 0"><b>Enrolment</b></td><td>${number}</td></tr><tr><td style="padding:2px 12px 2px 0"><b>Starts</b></td><td>${training_session.start_date}</td></tr><tr><td style="padding:2px 12px 2px 0"><b>Ends</b></td><td>${training_session.end_date}</td></tr><tr><td style="padding:2px 12px 2px 0"><b>Delivery</b></td><td>${training_session.delivery_mode} ${training_session.location}</td></tr><tr><td style="padding:2px 12px 2px 0"><b>Trainer</b></td><td>${training_session.trainer}</td></tr></table>' +
            '<p>Please add the session to your calendar. ${URI_REF}</p>' + FOOTER
    });
    upsert('sysevent_email_action', { collection: ENR, name: 'Enrolment rejected' }, {
        generation_type: 'engine', action_insert: false, action_update: true,
        condition: 'enrollment_statusCHANGESTOcancelled', recipient_fields: 'employee', content_type: 'text/html', active: true,
        subject: 'Enrolment ${number} not approved: ${training_session.session_name}',
        message_html: '<p>Hi ${employee.first_name},</p><p>Your request to attend <strong>${training_session.session_name}</strong> (${training_session.course}) was <strong>not approved</strong> and the enrolment ${number} has been cancelled.</p>' +
            '<p>Please speak to your manager if you believe this training is required for your role, or request a later session. ${URI_REF}</p>' + FOOTER
    });
    upsert('sysevent_email_action', { collection: ENR, name: 'Upcoming session reminder' }, {
        generation_type: 'event', event_name: 'x_2186817_employ_0.session.reminder', action_insert: false, action_update: false,
        recipient_fields: 'employee', content_type: 'text/html', active: true,
        subject: 'Reminder: ${training_session.session_name} starts ${event.parm1}',
        message_html: '<p>Hi ${employee.first_name},</p><p>This is a reminder that <strong>${training_session.session_name}</strong> (${training_session.course}) starts on <strong>${event.parm1}</strong>.</p>' +
            sessionTable + '<p>${URI_REF}</p>' + FOOTER
    });
    upsert('sysevent_email_action', { collection: CERT, name: 'Certification expiry reminder' }, {
        generation_type: 'event', event_name: 'x_2186817_employ_0.cert.expiring', action_insert: false, action_update: false,
        recipient_fields: 'employee', content_type: 'text/html', active: true,
        subject: 'Certification expiring: ${certification_name} on ${event.parm1}',
        message_html: '<p>Hi ${employee.first_name},</p><p>Your certification <strong>${certification_name}</strong> (${issuing_organisation}) expires on <strong>${event.parm1}</strong>.</p>' +
            '<p>Please renew it before that date and update the certification record (status, new expiry date, credential ID). ${URI_REF}</p>' + FOOTER
    });

    // Scheduled jobs
    var jobA = [
        "// ETCMS - Upcoming session reminders (daily). Queues x_2186817_employ_0.session.reminder for every enrolled",
        "// employee whose session starts within the next 3 days. The \"Upcoming session reminder\" notification sends the email.",
        "(function () {",
        "    var now = new GlideDateTime();",
        "    var horizon = new GlideDateTime();",
        "    horizon.addDaysUTC(3);",
        "    var s = new GlideRecord('x_2186817_employ_0_training_session');",
        "    s.addQuery('start_date', '>=', now);",
        "    s.addQuery('start_date', '<=', horizon);",
        "    s.addQuery('session_status', '!=', 'cancelled');",
        "    s.query();",
        "    var queued = 0;",
        "    while (s.next()) {",
        "        var e = new GlideRecord('x_2186817_employ_0_course_enrollment');",
        "        e.addQuery('training_session', s.getUniqueValue());",
        "        e.addQuery('enrollment_status', 'enrolled');",
        "        e.query();",
        "        while (e.next()) {",
        "            gs.eventQueue('x_2186817_employ_0.session.reminder', e, s.getDisplayValue('start_date'), s.getValue('session_name'));",
        "            queued++;",
        "        }",
        "    }",
        "    gs.info('ETCMS session reminders queued: ' + queued);",
        "})();"
    ].join('\n');
    var jobB = [
        "// ETCMS - Certification expiry reminders (daily). Queues x_2186817_employ_0.cert.expiring for every",
        "// certification expiring within 30 days whose status is not Expired, and moves Active ones to Renewal Pending.",
        "(function () {",
        "    var limit = new GlideDateTime();",
        "    limit.addDaysUTC(30);",
        "    var c = new GlideRecord('x_2186817_employ_0_employee_certification');",
        "    c.addQuery('expiry_date', '<=', limit.getDate());",
        "    c.addQuery('certification_status', '!=', 'expired');",
        "    c.query();",
        "    var queued = 0, flagged = 0;",
        "    while (c.next()) {",
        "        gs.eventQueue('x_2186817_employ_0.cert.expiring', c, c.getDisplayValue('expiry_date'), c.getValue('certification_status'));",
        "        queued++;",
        "        if (c.getValue('certification_status') == 'active') {",
        "            c.setValue('certification_status', 'renewal_pending');",
        "            c.update();",
        "            flagged++;",
        "        }",
        "    }",
        "    gs.info('ETCMS certification expiry reminders queued: ' + queued + ', set to renewal_pending: ' + flagged);",
        "})();"
    ].join('\n');
    upsert('sysauto_script', { name: 'ETCMS - Upcoming session reminders' }, { script: jobA, run_type: 'daily', run_time: '1970-01-01 06:00:00', active: true, conditional: false });
    upsert('sysauto_script', { name: 'ETCMS - Certification expiry reminders' }, { script: jobB, run_type: 'daily', run_time: '1970-01-01 06:15:00', active: true, conditional: false });
})();
