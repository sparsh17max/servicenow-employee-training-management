// ETCMS: create choice values for all choice fields (idempotent) — run in GLOBAL scope
var P = 'x_2186817_employ_0_';
var defs = [
  [P+'training_course', 'category', ['Technical:technical','Compliance:compliance','Leadership:leadership','Communication:communication']],
  [P+'training_course', 'difficulty_level', ['Beginner:beginner','Intermediate:intermediate','Advanced:advanced']],
  [P+'training_session', 'delivery_mode', ['In-person:in_person','Virtual:virtual','Hybrid:hybrid']],
  [P+'training_session', 'session_status', ['Planned:planned','Open:open','Completed:completed','Cancelled:cancelled']],
  [P+'course_enrollment', 'enrollment_status', ['Requested:requested','Enrolled:enrolled','Waitlisted:waitlisted','Completed:completed','Cancelled:cancelled']],
  [P+'course_enrollment', 'result', ['Not Assessed:not_assessed','Pass:pass','Fail:fail']],
  [P+'employee_certification', 'certification_status', ['Active:active','Expired:expired','Renewal Pending:renewal_pending']]
];
var created = 0, skipped = 0;
for (var i = 0; i < defs.length; i++) {
  var table = defs[i][0], element = defs[i][1], items = defs[i][2];
  for (var j = 0; j < items.length; j++) {
    var parts = items[j].split(':');
    var chk = new GlideRecord('sys_choice');
    chk.addQuery('name', table); chk.addQuery('element', element); chk.addQuery('value', parts[1]); chk.query();
    if (chk.hasNext()) { skipped++; continue; }
    var gr = new GlideRecord('sys_choice');
    gr.initialize();
    gr.name = table; gr.element = element; gr.label = parts[0]; gr.value = parts[1];
    gr.sequence = (j + 1) * 10; gr.language = 'en'; gr.inactive = false;
    gr.insert(); created++;
  }
}
gs.info('ETCMS choices created: ' + created + ', skipped (already existed): ' + skipped);
