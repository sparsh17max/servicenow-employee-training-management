// ETCMS Phase 2: default-view list layouts (idempotent) — run in GLOBAL scope
var P = 'x_2186817_employ_0_';
var lists = {};
lists[P+'training_course'] = ['course_name','course_code','category','difficulty_level','duration_hours','active'];
lists[P+'training_session'] = ['session_name','course','trainer','start_date','delivery_mode','session_status'];
lists[P+'course_enrollment'] = ['employee','training_session','enrollment_date','enrollment_status','result'];
lists[P+'employee_certification'] = ['employee','certification_name','issuing_organisation','expiry_date','certification_status'];

function applyList(table, view, cols) {
  var l = new GlideRecord('sys_ui_list');
  l.addQuery('name', table); l.addQuery('view', view); l.addNullQuery('parent'); l.addNullQuery('relationship'); l.query();
  if (!l.next()) { l.initialize(); l.name = table; l.view = view; l.insert(); }
  var del = new GlideRecord('sys_ui_list_element'); del.addQuery('list_id', l.sys_id); del.query();
  while (del.next()) del.deleteRecord();
  for (var i = 0; i < cols.length; i++) {
    var e = new GlideRecord('sys_ui_list_element'); e.initialize();
    e.list_id = l.sys_id; e.element = cols[i]; e.position = i; e.insert();
  }
  gs.info(table + ' list: ' + cols.length + ' columns');
}
for (var t in lists) applyList(t, 'Default view', lists[t]);
