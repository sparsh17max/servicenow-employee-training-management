// ETCMS Phase 2: default-view form layouts (idempotent) — run in GLOBAL scope
var P = 'x_2186817_employ_0_';
var layouts = {};
layouts[P+'training_course'] = ['course_name','course_code','category','difficulty_level','duration_hours','active','description'];
layouts[P+'training_session'] = ['session_name','course','trainer','start_date','end_date','delivery_mode','location','capacity','session_status'];
layouts[P+'course_enrollment'] = ['employee','training_session','enrollment_date','enrollment_status','completion_date','result','feedback'];
layouts[P+'employee_certification'] = ['employee','certification_name','issuing_organisation','credential_id','issue_date','expiry_date','certification_status','verification_url'];

function applyForm(table, view, fields) {
  var sec = new GlideRecord('sys_ui_section');
  sec.addQuery('name', table); sec.addQuery('view', view); sec.query();
  if (!sec.next()) { sec.initialize(); sec.name = table; sec.view = view; sec.header = true; sec.insert(); }
  var del = new GlideRecord('sys_ui_element'); del.addQuery('sys_ui_section', sec.sys_id); del.query();
  var removed = 0; while (del.next()) { del.deleteRecord(); removed++; }
  for (var i = 0; i < fields.length; i++) {
    var el = new GlideRecord('sys_ui_element'); el.initialize();
    el.sys_ui_section = sec.sys_id; el.element = fields[i]; el.position = i; el.type = 'element'; el.insert();
  }
  gs.info(table + ': removed ' + removed + ', added ' + fields.length);
}
for (var t in layouts) applyForm(t, 'Default view', layouts[t]);
