// ETCMS Phase 2: related lists + extra form views (idempotent) — run in GLOBAL scope
var P = 'x_2186817_employ_0_';

function applyRelated(table, entries) {
  var rl = new GlideRecord('sys_ui_related_list');
  rl.addQuery('name', table); rl.addQuery('view', 'Default view'); rl.query();
  if (!rl.next()) { rl.initialize(); rl.name = table; rl.view = 'Default view'; rl.insert(); }
  var del = new GlideRecord('sys_ui_related_list_entry'); del.addQuery('list_id', rl.sys_id); del.query();
  while (del.next()) del.deleteRecord();
  for (var i = 0; i < entries.length; i++) {
    var e = new GlideRecord('sys_ui_related_list_entry'); e.initialize();
    e.list_id = rl.sys_id; e.related_list = entries[i]; e.position = i; e.insert();
  }
}
applyRelated(P+'training_course', [P+'training_session.course']);
applyRelated(P+'training_session', [P+'course_enrollment.training_session']);

function getView(name, title) {
  var v = new GlideRecord('sys_ui_view'); v.addQuery('name', name); v.query();
  if (v.next()) return v.sys_id + '';
  v.initialize(); v.name = name; v.title = title; return v.insert() + '';
}
function applyFormView(table, viewSysId, fields) {
  var sec = new GlideRecord('sys_ui_section');
  sec.addQuery('name', table); sec.addQuery('view', viewSysId); sec.query();
  if (!sec.next()) { sec.initialize(); sec.name = table; sec.view = viewSysId; sec.header = true; sec.insert(); }
  var del = new GlideRecord('sys_ui_element'); del.addQuery('sys_ui_section', sec.sys_id); del.query();
  while (del.next()) del.deleteRecord();
  for (var i = 0; i < fields.length; i++) {
    var el = new GlideRecord('sys_ui_element'); el.initialize();
    el.sys_ui_section = sec.sys_id; el.element = fields[i]; el.position = i; el.type = 'element'; el.insert();
  }
}
applyFormView(P+'course_enrollment', getView('hr', 'HR'), ['employee','training_session','enrollment_status','enrollment_date','completion_date']);
applyFormView(P+'course_enrollment', getView('training_manager', 'Training Manager'), ['training_session','employee','result','feedback']);
