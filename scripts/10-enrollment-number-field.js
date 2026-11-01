/**
 * 10 — Course Enrollment auto-number (Phase 4 enhancement)
 *
 * Gives Course Enrollment a display value: a Number field (ENR0001001, ENR0001002, …)
 * instead of "Created <timestamp>".
 *
 * Run from Scripts - Background in the **app** scope. Idempotent.
 * What it does:
 *   1. sys_number record for the table (prefix ENR, start 1000, 7 digits) — inserting this
 *      record makes the platform create the `number` column automatically.
 *   2. Dictionary entry `number`: display = true, default javascript:global.getNextObjNumberPadded();
 *   3. sys_db_object.number_ref → the sys_number record.
 *   4. Back-fills existing enrollments in creation order and moves the counter past them.
 *   5. Puts `number` first on the Default / HR / Training Manager form views and the default list.
 */
(function () {
    var TABLE = 'x_2186817_employ_0_course_enrollment';

    // 1. numbering record
    var num = new GlideRecord('sys_number');
    num.addQuery('category', TABLE);
    num.query();
    if (!num.next()) {
        num.initialize();
        num.setValue('category', TABLE);
        num.setValue('prefix', 'ENR');
        num.setValue('number', 1000);
        num.setValue('maximum_digits', 7);
        num.insert();
        gs.info('10: sys_number created');
    }

    // 2. dictionary entry (created by the platform when sys_number is inserted; create if missing)
    var dict = new GlideRecord('sys_dictionary');
    dict.addQuery('name', TABLE);
    dict.addQuery('element', 'number');
    dict.query();
    if (!dict.next()) {
        dict.initialize();
        dict.setValue('name', TABLE);
        dict.setValue('element', 'number');
        dict.setValue('column_label', 'Number');
        dict.setValue('internal_type', 'string');
        dict.setValue('max_length', 40);
        dict.insert();
        dict.get(dict.getUniqueValue());
    }
    dict.setValue('display', true);
    dict.setValue('default_value', 'javascript:global.getNextObjNumberPadded();');
    dict.update();

    // 3. link the table to the counter
    var tbl = new GlideRecord('sys_db_object');
    if (tbl.get('name', TABLE) && tbl.getValue('number_ref') != num.getUniqueValue()) {
        tbl.setValue('number_ref', num.getUniqueValue());
        tbl.update();
    }

    // 4. back-fill existing records
    var n = parseInt(num.getValue('number'), 10);
    var gr = new GlideRecord(TABLE);
    gr.addNullQuery('number');
    gr.orderBy('sys_created_on');
    gr.orderBy('sys_id');
    gr.query();
    var filled = 0;
    while (gr.next()) {
        n++;
        gr.setValue('number', 'ENR' + ('0000000' + n).slice(-7));
        gr.setWorkflow(false);
        gr.update();
        filled++;
    }
    if (filled) {
        num.setValue('number', n);
        num.update();
    }
    gs.info('10: back-filled ' + filled + ' enrollments; counter at ' + n);

    // 5. layouts — number first
    function putFirst(table, fk, parentId) {
        var el = new GlideRecord(table);
        el.addQuery(fk, parentId);
        el.addQuery('element', 'number');
        el.query();
        var exists = el.next();
        var others = new GlideRecord(table);
        others.addQuery(fk, parentId);
        others.addQuery('element', '!=', 'number');
        others.orderByDesc('position');
        others.query();
        while (others.next()) {
            others.setValue('position', parseInt(others.getValue('position'), 10) + 1);
            others.update();
        }
        if (exists) {
            el.setValue('position', 0);
            el.update();
        } else {
            el.initialize();
            el.setValue(fk, parentId);
            el.setValue('element', 'number');
            el.setValue('position', 0);
            if (table == 'sys_ui_element') el.setValue('type', 'element');
            el.insert();
        }
    }
    var sec = new GlideRecord('sys_ui_section');
    sec.addQuery('name', TABLE);
    sec.query();
    while (sec.next()) putFirst('sys_ui_element', 'sys_ui_section', sec.getUniqueValue());
    var list = new GlideRecord('sys_ui_list');
    list.addQuery('name', TABLE);
    list.addQuery('view', 'Default view');
    list.addNullQuery('sys_user');
    list.query();
    while (list.next()) putFirst('sys_ui_list_element', 'list_id', list.getUniqueValue());
    gs.info('10: layouts updated');
})();
