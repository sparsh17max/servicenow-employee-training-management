/**
 * 08 — Client Script: Validate End Date after Start Date (Phase 4, Step 18)
 *
 * Creates the onSubmit Client Script on Training Session that blocks submission
 * when End Date is not later than Start Date.
 *
 * Run from System Definition > Scripts - Background with the application scope
 * set to "Employee Training and Certification Management" (x_2186817_employ_0),
 * so the sys_script_client record is created inside the app.
 * Idempotent: re-running updates the existing record instead of duplicating it.
 *
 * Equivalent Table API call (basic auth, app scope selected for the session):
 *   POST /api/now/table/sys_script_client
 *   { "table": TABLE, "name": NAME, "type": "onSubmit", "ui_type": "10",
 *     "active": "true", "global": "true", "description": DESCRIPTION, "script": SCRIPT }
 */
(function () {
    var TABLE = 'x_2186817_employ_0_training_session';
    var NAME = 'Validate End Date after Start Date';
    var DESCRIPTION = 'Blocks submission of a Training Session whose End Date is not later than its Start Date. ' +
        'Client-side companion to the Location UI Policy; server-side data integrity is handled by Business Rules.';

    var SCRIPT = [
        'function onSubmit() {',
        "    var start = g_form.getValue('start_date');",
        "    var end = g_form.getValue('end_date');",
        '    if (!start || !end) return true;',
        "    var startMs = new Date(start.replace(' ', 'T')).getTime();",
        "    var endMs = new Date(end.replace(' ', 'T')).getTime();",
        '    if (isNaN(startMs) || isNaN(endMs)) return true;',
        '    if (endMs <= startMs) {',
        '        g_form.clearMessages();',
        "        g_form.showFieldMsg('end_date', 'End Date must be later than Start Date.', 'error');",
        "        g_form.addErrorMessage('Session not saved: End Date must be later than Start Date.');",
        '        return false;',
        '    }',
        '    return true;',
        '}'
    ].join('\n');

    var gr = new GlideRecord('sys_script_client');
    gr.addQuery('table', TABLE);
    gr.addQuery('name', NAME);
    gr.query();
    var isNew = !gr.next();
    if (isNew) gr.initialize();

    gr.setValue('table', TABLE);
    gr.setValue('name', NAME);
    gr.setValue('type', 'onSubmit');
    gr.setValue('ui_type', '10');      // All (desktop + mobile/Service Portal)
    gr.setValue('global', true);       // all views
    gr.setValue('active', true);
    gr.setValue('description', DESCRIPTION);
    gr.setValue('script', SCRIPT);

    var id = isNew ? gr.insert() : gr.update();
    gs.info('08-client-script-end-date: ' + (isNew ? 'created ' : 'updated ') + NAME + ' (' + id + ')');
})();
