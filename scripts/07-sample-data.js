// ETCMS Phase 3: sample data (idempotent by code/name) — run in APP scope x_2186817_employ_0
// NOTE: date/time strings assigned with setValue() are interpreted as UTC. Use setDisplayValue()
// (or the Table API with sysparm_input_display_value=true) for values meant in the user's time zone.
var P = 'x_2186817_employ_0_';
function user(u) { var g = new GlideRecord('sys_user'); g.addQuery('user_name', u); g.query(); if (g.next()) return g.sys_id + ''; g = new GlideRecord('sys_user'); g.addQuery('active', true); g.addNotNullQuery('email'); g.setLimit(1); g.query(); g.next(); gs.info('fallback user for ' + u); return g.sys_id + ''; }
function upsert(table, keyField, keyVal, vals) { var g = new GlideRecord(table); g.addQuery(keyField, keyVal); g.query(); var isNew = !g.next(); if (isNew) { g.initialize(); g.setValue(keyField, keyVal); } for (var k in vals) g.setValue(k, vals[k]); return isNew ? g.insert() : (g.update(), g.sys_id + ''); }

var courses = [
 ['TRN001','ServiceNow Fundamentals','technical','beginner',12,'Introduction to the ServiceNow platform: navigation, lists, forms, tables and basic administration.'],
 ['TRN002','Advanced Excel','technical','intermediate',8,'Pivot tables, Power Query, lookup functions and dashboard building.'],
 ['TRN003','Data Analytics Basics','technical','beginner',15,'Descriptive statistics, data cleaning and visualisation fundamentals.'],
 ['TRN004','Business Communication','communication','beginner',6,'Clear written and verbal communication for the workplace.'],
 ['TRN005','Leadership Essentials','leadership','intermediate',10,'Core people-leadership skills for new and aspiring managers.'],
 ['TRN006','Information Security Awareness','compliance','beginner',4,'Mandatory annual security awareness: phishing, passwords, data handling.']
];
var C = {}; courses.forEach(function(c){ C[c[0]] = upsert(P+'training_course','course_code',c[0],{course_name:c[1],category:c[2],difficulty_level:c[3],duration_hours:c[4],description:c[5],active:true}); });

var sessions = [
 ['SN Fundamentals Batch 1','TRN001','abel.tuter','2026-11-10 09:00:00','2026-11-12 17:00:00','virtual','Microsoft Teams',20,'open'],
 ['SN Fundamentals Batch 2','TRN001','abel.tuter','2026-12-01 09:00:00','2026-12-03 17:00:00','in_person','Novatrix Pune - Training Room B',15,'planned'],
 ['Excel Training Batch 1','TRN002','fred.luddy','2026-09-15 10:00:00','2026-09-16 16:00:00','virtual','Zoom',25,'completed'],
 ['Analytics Workshop','TRN003','david.loo','2026-11-18 09:30:00','2026-11-20 17:30:00','hybrid','Pune Training Room A / Teams',20,'open'],
 ['Leadership Workshop','TRN005','bow.ruggeri','2026-10-06 09:00:00','2026-10-07 17:00:00','in_person','Novatrix Pune - Boardroom',10,'completed'],
 ['Security Awareness Q4','TRN006','rick.berzle','2026-10-20 14:00:00','2026-10-20 16:00:00','virtual','Microsoft Teams',50,'completed']
];
var S = {}; sessions.forEach(function(s){ var g = new GlideRecord(P+'training_session'); g.addQuery('session_name', s[0]); g.query(); var isNew = !g.next(); if (isNew) { g.initialize(); g.session_name = s[0]; } g.course = C[s[1]]; g.trainer = user(s[2]); g.setDisplayValue('start_date', s[3]); g.setDisplayValue('end_date', s[4]); g.delivery_mode = s[5]; g.location = s[6]; g.capacity = s[7]; g.session_status = s[8]; S[s[0]] = isNew ? g.insert() : (g.update(), g.sys_id + ''); });

var enr = [
 ['beth.anglin','SN Fundamentals Batch 1','2026-10-30','enrolled','','not_assessed',''],
 ['david.miller','SN Fundamentals Batch 1','2026-10-28','enrolled','','not_assessed',''],
 ['luke.wilson','SN Fundamentals Batch 1','2026-10-29','requested','','not_assessed',''],
 ['alejandro.mascall','SN Fundamentals Batch 1','2026-10-31','waitlisted','','not_assessed',''],
 ['carol.coughlin','Excel Training Batch 1','2026-09-01','completed','2026-09-16','pass','Great hands-on examples with Power Query.'],
 ['eric.schroeder','Excel Training Batch 1','2026-09-02','completed','2026-09-16','pass','Would like a follow-up on macros.'],
 ['jerrod.bennett','Excel Training Batch 1','2026-09-03','completed','2026-09-16','fail','Missed day 2 due to an incident.'],
 ['bernard.laboy','Excel Training Batch 1','2026-09-05','cancelled','','not_assessed','Scheduling conflict.'],
 ['christen.mitchell','Leadership Workshop','2026-09-20','completed','2026-10-07','pass','Useful frameworks for 1:1s.'],
 ['beth.anglin','Leadership Workshop','2026-09-22','completed','2026-10-07','pass',''],
 ['david.miller','Security Awareness Q4','2026-10-10','completed','2026-10-20','pass',''],
 ['luke.wilson','Security Awareness Q4','2026-10-10','completed','2026-10-20','pass',''],
 ['carol.coughlin','Analytics Workshop','2026-10-25','enrolled','','not_assessed',''],
 ['eric.schroeder','Analytics Workshop','2026-10-26','requested','','not_assessed','']
];
enr.forEach(function(e){ var emp = user(e[0]); var g = new GlideRecord(P+'course_enrollment'); g.addQuery('employee', emp); g.addQuery('training_session', S[e[1]]); g.query(); if (g.next()) return; g.initialize(); g.employee = emp; g.training_session = S[e[1]]; g.enrollment_date = e[2]; g.enrollment_status = e[3]; if (e[4]) g.completion_date = e[4]; g.result = e[5]; g.feedback = e[6]; g.insert(); });

var certs = [
 ['beth.anglin','ServiceNow Certified System Administrator','ServiceNow','CSA-2025-118342','2025-03-14','2026-03-14','active','https://www.credly.com/badges/example-csa'],
 ['carol.coughlin','Microsoft Office Specialist: Excel Associate','Microsoft','MOS-EXC-77421','2024-11-02','2027-11-02','active',''],
 ['eric.schroeder','Google Data Analytics Professional Certificate','Google / Coursera','GDA-55A1C9','2024-01-20','2026-01-20','renewal_pending',''],
 ['jerrod.bennett','Information Security Awareness','Novatrix Solutions (internal)','ISA-2025-0219','2025-10-01','2026-10-01','expired',''],
 ['christen.mitchell','Project Management Fundamentals','PMI','PMF-908112','2025-06-30','2028-06-30','active',''],
 ['abel.tuter','ServiceNow Certified Application Developer','ServiceNow','CAD-2024-77120','2024-08-08','2026-08-08','renewal_pending','']
];
certs.forEach(function(c){ var emp = user(c[0]); var g = new GlideRecord(P+'employee_certification'); g.addQuery('credential_id', c[3]); g.query(); if (g.next()) return; g.initialize(); g.employee = emp; g.certification_name = c[1]; g.issuing_organisation = c[2]; g.credential_id = c[3]; g.issue_date = c[4]; g.expiry_date = c[5]; g.certification_status = c[6]; g.verification_url = c[7]; g.insert(); });
gs.info('ETCMS sample data done');
