/**
 * 09 — Business Rule: Completed requires Completion Date (Phase 4, Step 19)
 *
 * Creates a before insert/update Business Rule on Course Enrollment that aborts the
 * save when Enrollment Status = Completed and Completion Date is empty.
 *
 * Run from Scripts - Background with the application scope set to
 * "Employee Training and Certification Management" (x_2186817_employ_0).
 * Idempotent: re-running updates the existing record.
 *
 * Equivalent Table API call (session set to the app scope):
 *   POST /api/now/table/sys_script
 *   { "collection": TABLE, "name": NAME, "when": "before", "action_insert": "true",
 *     "action_update": "true", "order": "100", "advanced": "true", "active": "true",
 *     "filter_condition": CONDITION, "description": DESCRIPTION, "script": SCRIPT }
 */
(function () {
    var TABLE = 'x_2186817_employ_0_course_enrollment';
    var NAME = 'Completed requires Completion Date';
    var CONDITION = 'enrollment_status=completed^completion_dateISEMPTY^EQ';
    var DESCRIPTION = 'Server-side integrity rule: aborts insert/update when Enrollment Status is Completed ' +
        'but Completion Date is empty. Applies to UI saves, imports and REST, unlike a client script.';

    var SCRIPT = [
        '(function executeRule(current, previous /*null when async*/) {',
        "    gs.addErrorMessage(gs.getMessage('An enrollment cannot be marked Completed until its Completion Date is populated.'));",
        '    current.setAbortAction(true);',
        '})(current, previous);'
    ].join('\n');

    var gr = new GlideRecord('sys_script');
    gr.addQuery('collection', TABLE);
    gr.addQuery('name', NAME);
    gr.query();
    var isNew = !gr.next();
    if (isNew) gr.initialize();

    gr.setValue('collection', TABLE);
    gr.setValue('name', NAME);
    gr.setValue('when', 'before');
    gr.setValue('action_insert', true);
    gr.setValue('action_update', true);
    gr.setValue('action_delete', false);
    gr.setValue('action_query', false);
    gr.setValue('order', 100);
    gr.setValue('advanced', true);
    gr.setValue('active', true);
    gr.setValue('filter_condition', CONDITION);
    gr.setValue('description', DESCRIPTION);
    gr.setValue('script', SCRIPT);

    var id = isNew ? gr.insert() : gr.update();
    gs.info('09-business-rule-completed-date: ' + (isNew ? 'created ' : 'updated ') + NAME + ' (' + id + ')');
})();
