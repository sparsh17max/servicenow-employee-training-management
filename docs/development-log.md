# Development Log

Format for each entry: **what** I implemented, **why**, and **what I learned**.

## 2026-10-30 — Phase 1, Step 1: Scoped application created
- **What:** Created scoped application *Employee Training and Certification Management* in App Engine Studio with default `admin` and `user` roles and a custom logo.
- **Why:** A scoped app isolates tables, roles and logic under one namespace and is the standard unit of deployment.
- **Learned:** AES auto-generates the scope prefix (here `x_2186817_employ_0`); all tables and roles inherit it. An ampersand in the app name is stored HTML-encoded (`&amp;`), so plain words are safer.
- **Evidence:** `screenshots/application-dashboard.png`

## Issue log
| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-10-30 | "Try Again. If the problem continues…" banner on first dashboard load | Dismissed; transient AES widget error | AES dashboard widgets load asynchronously |
| 2026-10-30 | App name rendered as `Employee Training &amp;…` | Renamed app in settings to use "and" | Special characters in app names are HTML-encoded |

## 2026-10-30 — Phase 1, Steps 2–5: Four custom tables and 31 fields
- **What:** Created `training_course` (7 fields), `training_session` (9), `course_enrollment` (7) and `employee_certification` (8) via *System Definition → Tables*, with each table's module added to a single **ETCMS** application menu. Fields were added one at a time through the Dictionary Entry form. Reference fields: `training_session.course → training_course`, `training_session.trainer → sys_user`, `course_enrollment.employee → sys_user`, `course_enrollment.training_session → training_session`, `employee_certification.employee → sys_user`. Display fields: Course Name, Session Name, Certification Name. Defaults: `active=true`, `session_status=planned`, `enrollment_status=requested`, `result=not_assessed`, `certification_status=active`.
- **Why:** The table form plus Dictionary Entry form exposes every setting the CSA exam covers (type, max length, reference target, display flag, default value, choice behaviour), whereas App Engine Studio hides some of them.
- **Learned:** The dictionary form can be pre-filled through `sysparm_query` in the URL (`name=…^element=…^internal_type=…^reference=…`), which makes repetitive field creation fast and consistent. `choice=1` sets "Dropdown with -- None --". Choice *values* live in `sys_choice`, not in the dictionary entry.
- **Evidence:** `screenshots/data-dictionary-all-tables.jpg`, `screenshots/training-course-form.jpg`, `screenshots/training-session-form.jpg`

## 2026-10-30 — Phase 1: Choice values (25) via background script
- **What:** Inserted the 25 choice values for the 7 choice fields with an idempotent background script (`sys.scripts.do`) that checks for an existing `sys_choice` row before inserting, sets lowercase values and sequences of 10/20/30…, and logs created/skipped counts.
- **Why:** 25 near-identical records; a script is faster and guarantees consistent values. Values are deliberately stable lowercase snake_case (`in_person`, `renewal_pending`) because records store the value, not the label.
- **Learned:** Running the script *in the application scope* failed: `sys_choice` refuses create/put from a scoped app ("cross-scope access policy"). Re-running in **global** scope succeeded (`insert sys_choice 25`, 7 `sys_choice_set` rows). Scoped apps have restricted write access to many platform tables; choice lists for scoped tables are normally managed through the UI or from global.

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-10-30 | Dictionary form's **Create Choice List** button navigated to "Record not found" and did not save the Category field; it also left behind a blank `sys_choice` row | Re-created the field with plain Submit; deleted the blank choice (visible as an empty option in the dropdown) | Verify choice lists in `sys_choice_list.do` after creating a choice field |
| 2026-10-30 | Typing in "New menu name" appended to the auto-filled label (`Training CourseETCMS`) | Select-all before typing | Classic forms auto-fill dependent fields on blur |
| 2026-10-30 | Background script in app scope: `Create operation against 'sys_choice' … refused` | Ran in global scope | Cross-scope access policy on platform tables |

## 2026-10-30 — Phase 2, Steps 6–11: Forms, lists, related lists and views
- **What:** Configured the default form layout for all four tables in the order from the project guide; default list layouts (6/6/5/5 columns); related lists **Training Sessions** on Training Course (`training_session.course`) and **Course Enrollments** on Training Session (`course_enrollment.training_session`); and two extra form views on Course Enrollment — **HR** (Employee, Training Session, Enrollment Status, Enrollment Date, Completion Date) and **Training Manager** (Training Session, Employee, Result, Feedback). Applied with the scripts in `scripts/02–04` (global scope), then verified in the UI.
- **Why:** Forms and lists are how users actually meet the data model; related lists make the one-to-many relationships visible; views let different audiences see only what they need without separate tables.
- **Learned:** Form layout = `sys_ui_section` (one per table+view) + `sys_ui_element` rows (position order). List layout = `sys_ui_list` + `sys_ui_list_element`. Related lists = `sys_ui_related_list` + `sys_ui_related_list_entry` whose `related_list` value is `<child_table>.<reference_field>`. Views are `sys_ui_view` records; a view with no section falls back to the default view. The default view's sys_id is literally `Default view`.
- **Tested (all passed):**
  - TC-01 Created *ServiceNow Fundamentals* (TRN001) — saved; list shows the 6 configured columns.
  - TC-02 On Training Session, typing "ServiceNow" in **Course** autocompleted *ServiceNow Fundamentals* (display field working).
  - TC-03 **Trainer** autocompleted *Abel Tuter* from `sys_user`.
  - TC-05 Opening the course shows the *Training Sessions* related list filtered to `Course = ServiceNow Fundamentals`.
  - TC-07 Clicking **New** in the session's *Course Enrollments* related list opened an enrollment form with **Training Session pre-populated** — the reference back to the parent is injected from the related-list context.
  - TC-04 / TC-06 Saved an enrollment for *Beth Anglin* (Enrolled); it appears in the session's related list.
  - Opening the enrollment with `sysparm_view=hr` renders the 5-field HR view.
- **Evidence:** `screenshots/training-course-list.jpg`, `screenshots/related-list-course-sessions.jpg`, `screenshots/enrollment-from-related-list-autopopulated.jpg`, `screenshots/related-list-session-enrollments.jpg`, `screenshots/enrollment-hr-view.jpg`
- **Observation / future enhancement:** Course Enrollment has no display field, so records are labelled "Created <timestamp>". A `Number` field (e.g. ENR0001001) with auto-numbering would be a better display value — logged for Phase 4.

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-10-30 | PDI session expired mid-phase (login page appeared on `sys.scripts.do`) | Logged in again and re-ran | PDI sessions time out; keep scripts idempotent so re-runs are safe |
| 2026-10-30 | First form-layout run reported "removed 10 / removed 15" on Course and Session | Expected — table creation auto-generates a default section containing every field; the script replaced it | New tables get an auto-generated form section |

## 2026-10-31 — Instance branding: dummy company, logo and UI16 header
- **What:** Created a fictional customer, **Novatrix Solutions** (Pune, ~300 employees) as a `core_company` record and set it as the **primary** company (*System Properties → My Company*). Designed a logo (`brand/`: header wordmark in white and dark variants, square icon). Branded the Next Experience / UI16 header: caption "Novatrix Solutions - Employee Training & Certification", browser tab title "Novatrix ETCMS", header background `#0F172A`, divider `#2DD4BF`, banner image `novatrix-header.png` (`glide.product.image` / `glide.product.image.light`).
- **Why:** A portfolio instance that looks like a real customer environment demonstrates understanding of system properties and branding, and makes screenshots/demo recordings far more convincing.
- **Learned:** Header branding lives in `sys_properties` (`glide.product.*`, `css.$navpage-*`). Banner images are `db_image` records whose picture is a `sys_attachment` with `table_name = ZZ_YYdb_image` and `file_name = image`. The *Basic Configuration UI16* page refused to save while the session's application scope was the ETCMS app (global properties), so the properties were set by script in global scope.
- **Evidence:** `screenshots/branded-header-novatrix.jpg`, `screenshots/branded-header-closeup.png`

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-10-31 | `GlideSysAttachment.writeBase64()` returned `undefined` from Scripts - Background and created no attachment, so the header showed a broken image | Uploaded the PNG through the **Attachment REST API** (`/api/now/attachment/file?table_name=ZZ_YYdb_image&table_sys_id=…&file_name=image`) from the authenticated browser session, then PATCHed `db_image.image` | REST attachment API is the reliable way to attach binaries; `user_image` fields need the `ZZ_YY<table>` attachment convention |
| 2026-10-31 | Asia/Kolkata not available in the system time-zone dropdown | Left as default; add via *Configure available time zones* later | Available time zones are a curated choice list |
| 2026-10-31 | `sysparm_query` URL prefill truncated the company Notes at `&` and dropped `+` from the phone | Re-typed both fields before submitting | URL prefill needs percent-encoding for `&`, `+`, `#` |

## 2026-10-31 — Phase 3, Steps 12–16: Sample data and application testing
- **What:** Loaded realistic data with `scripts/07-sample-data.js` (run in the app scope): 6 courses, 6 sessions (3 completed in Sept/Oct, 2 open in Nov, 1 planned in Dec), 14 enrollments covering all five statuses, 6 certifications covering all three statuses. Details in [sample-data.md](sample-data.md). Added the four ETCMS modules, the ETCMS application, Scripts - Background, Flow Designer and App Engine Studio to the navigator **Favorites**.
- **Why:** The guide's point — four empty tables prove nothing. Realistic distributions (past vs. upcoming sessions, pass/fail, expired vs. active) are also what Phase 4's reports and the certification-expiry reminder need.
- **Learned:** `GlideRecord.setValue()` on a Date/Time field treats the string as **UTC**; the sessions showed 01:00 instead of 09:00 in the UI because the instance time zone is America/Los_Angeles. `setDisplayValue()` (or `sysparm_input_display_value=true` on the Table API) interprets the value in the user's time zone. Favorites are `sys_ui_bookmark` rows, but the Next Experience navigator only lists ones created through its own star control.
- **Tested (all passed):** TC-01 to TC-09 re-run with populated data — see [test-cases.md](test-cases.md). Highlights: filter `Enrollment Status = Completed` returns exactly 7; TRN001 shows both batches in its related list; certification form resolves Employee and renders Verification URL as a link.
- **Evidence:** `screenshots/enrollments-all-statuses.jpg`, `screenshots/enrollments-filter-completed.jpg`, `screenshots/certifications-list.jpg`, `screenshots/certification-form.jpg`, `screenshots/courses-list-6.jpg`, `screenshots/course-related-list-two-sessions.jpg`, `screenshots/favorites-menu.jpg`

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-10-31 | Session Start/End showed 01:00 instead of 09:00 | Re-saved with display values via the Table API (`sysparm_input_display_value=true`); script updated to `setDisplayValue()` | Date/Time storage is UTC; set values via display-value APIs |
| 2026-10-31 | Demo user `joe.employee` does not exist in this PDI; fallback picked "survey user" | Re-assigned those two enrollments to David Miller; script updated | Always verify demo users exist before seeding |
| 2026-10-31 | Bookmarks inserted via REST did not appear in the Next Experience Favorites menu | Starred modules from the All menu instead | Favorites created outside the navigator UI are not picked up |

## 2026-10-31 — Phase 4, Step 17: UI Policy
- **What:** UI Policy *Location is mandatory unless the session is Virtual* on Training Session — condition `Delivery Mode is not Virtual`, On load, Reverse if false; action `location` → Mandatory = True.
- **Why:** The guide asks "when Virtual, Location is not mandatory". A UI Policy cannot relax a dictionary-level mandatory flag, so the field stays optional in the dictionary and the policy *adds* the requirement for non-virtual sessions; *Reverse if false* removes it again when Virtual is chosen.
- **Learned:** UI Policy = `sys_ui_policy` (conditions, on load, reverse if false) + `sys_ui_policy_action` rows (field, mandatory/visible/read-only). Client-side only — a Data Policy or Business Rule is needed to enforce the same rule for imports/API.
- **Evidence:** `screenshots/ui-policy-location.jpg`

## 2026-11-01 — Phase 5: GitHub repository published
- **What:** Initialised the repository with one commit per phase (Phase 1 data model, Phase 2 forms/lists, Branding, Phase 3 sample data, Phase 4 start + handoff) using backdated author dates matching the changelog, created the public repo `sparsh17max/servicenow-employee-training-management` with `gh repo create --source . --push`, and added an author line to the README. `.env` is git-ignored; only `.env.example` is committed.
- **Why:** Phase 5 of the project guide asks for GitHub documentation; a phase-by-phase history reads as a build narrative rather than a single dump.
- **Learned:** `GIT_AUTHOR_DATE` / `GIT_COMMITTER_DATE` control the commit timestamps, so a history can be reconstructed from dated notes. `gh repo create --source` creates the remote, adds `origin` and pushes in one step. Git is configured per-repo (`git config user.name`) so this project uses a different GitHub identity from the rest of the machine.
- **Evidence:** https://github.com/sparsh17max/servicenow-employee-training-management

## 2026-11-01 — Phase 4, Step 18: Client Script "Validate End Date after Start Date"
- **What:** Created the onSubmit Client Script on Training Session (UI Type All, all views, scope `x_2186817_employ_0`, sys_id `4e87882d935cd710803931697bba1075`) through `POST /api/now/table/sys_script_client`, after switching the session's current application with `PUT /api/now/ui/concoursepicker/application`. The same definition is kept as the idempotent background script `scripts/08-client-script-end-date.js`.
- **Why:** The guide's second Phase 4 automation: block a session whose End Date is not after its Start Date. An onSubmit script is the right type because the check needs both fields and should run once at save, not on every field change; `return false` cancels the submit.
- **Learned:** `g_form.getValue()` on a Date/Time field returns the display-format string in the user's time zone; replacing the space with `T` makes it parseable by `Date` consistently across browsers. `ui_type=10` is "All" (desktop and mobile/portal) in `sys_script_client`. Metadata created through the Table API lands in the session's *current application*, so the application picker must be set first (or the record ends up in Global).
- **Tested (TC-11, passed):** In a headless Chrome session (cookies injected, form driven through `g_form` and `gsftSubmit`) a new session with Start `2026-11-10 09:00` and End `2026-11-09 17:00` was rejected: form-level error "Session not saved: End Date must be later than Start Date.", field message under End Date, URL still `sys_id=-1`, no record on the server. Positive control: End corrected to `2026-11-10 17:00` → submitted and saved (test record *TC-11 End Date validation*, sys_id `5008c86d935cd710803931697bba1040`).
- **Evidence:** `screenshots/client-script-end-date-blocked.png`

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-11-01 | Table API returned `401 User is not authenticated` for HTTP Basic auth with the admin password, even after a reset and a successful browser login with the same password | Switched to **session authentication**: form POST to `/login.do` (with the page's `sysparm_ck`), keep the cookie jar, read `g_ck` from a UI page and send it as `X-UserToken` on every REST call | REST over a UI session needs the `X-UserToken` header, otherwise the Table API answers 401 even with valid cookies; Basic auth for the PDI admin stayed unexplained (MFA is off, account not locked), so the session route is the reliable one on this instance |
| 2026-11-01 | No Playwright / Node on the machine for client-side tests | Drove the installed Chrome headless through the DevTools Protocol from PowerShell (`--remote-debugging-port`, `Runtime.evaluate`, `Page.captureScreenshot`) | Client scripts can only be proven in a real form; a CDP driver is enough for form fill + submit + screenshot |

## 2026-11-01 — Phase 4, Step 19: Business Rule "Completed requires Completion Date"
- **What:** Created a **before insert/update** Business Rule on Course Enrollment (order 100, condition `enrollment_status=completed^completion_dateISEMPTY`, scope `x_2186817_employ_0`, sys_id `29a7c8e9935cd710803931697bba10e2`) via `POST /api/now/table/sys_script`. The script adds an error message and calls `current.setAbortAction(true)`. Reproducible as `scripts/09-business-rule-completed-date.js`.
- **Why:** The guide's data-integrity rule: an enrollment cannot be Completed without a Completion Date. A *before* rule runs inside the database transaction and applies to every path (form, list editor, import, REST), unlike the client-side checks in Steps 17–18.
- **Learned:** The filter condition is evaluated before the script, so the script body stays trivial. Aborting from a before rule surfaces to the Table API as `403 Operation Failed … aborted by Business Rule`, and in the form as the custom message plus the platform's generic "Invalid update". `gs.getMessage()` keeps the text translatable.
- **Tested (TC-12, passed):** REST `PATCH` of Luke Wilson's *requested* enrollment to `completed` with no date → 403 aborted, record unchanged. REST `POST` of a new completed enrollment without a date → 403, enrollment count still 14. UI: same record, status set to Completed, Update → red banner with the message, server still *requested*. Positive control: `completed` + `completion_date=2026-11-01` → 200, then reverted to *requested* with an empty date.
- **Evidence:** `screenshots/business-rule-completed-blocked.png`

## 2026-11-01 — Phase 4 enhancement: Course Enrollment auto-number (ENR…)
- **What:** Added a `sys_number` record for Course Enrollment (prefix **ENR**, start 1000, 7 digits) and linked it from the table (`number_ref`). The platform created the `number` column on insert of the numbering record; I set it as the **display** field with default `javascript:global.getNextObjNumberPadded();`, back-filled the 14 existing enrollments in creation order (ENR0001001–ENR0001014), moved the counter to 1014, and put *Number* first on the Default, HR and Training Manager form views and on the default list. Reproducible as `scripts/10-enrollment-number-field.js`.
- **Why:** Logged in Phase 2: enrollments were labelled "Created <timestamp>" in reference fields, related lists and approvals. A number is what the Phase 4 flow, notifications and reports should show.
- **Learned:** Inserting a `sys_number` row auto-creates the `number` field and appends it to the default form, so the dictionary entry only needs `display` and layout position afterwards. In a scoped app the generated default is `global.getNextObjNumberPadded()` (the function lives in global), and my first patch to the un-prefixed name had to be reverted. `sys_db_object.number_ref` is what *Number Maintenance* shows for the table.
- **Tested (TC-13, passed):** List shows the Number column first (ENR0001001 Beth Anglin …); a new enrollment form opens with Number pre-filled **ENR0001015**; the Table API display value of an existing record is now its number (`ENR0001003`).
- **Evidence:** `screenshots/enrollment-list-number-column.png`, `screenshots/enrollment-form-auto-number.png`

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-11-01 | Patched the dictionary default to `javascript:getNextObjNumberPadded();` (no `global.`), which would not resolve from the scoped table | Restored `javascript:global.getNextObjNumberPadded();` | Scoped apps call global script includes/functions with the `global.` prefix |

## 2026-11-01 — Phase 4, Step 20: Notifications and daily reminder jobs
- **What:** Four notifications in the app scope, two registered events, two daily Scheduled Script Executions and the *Training Managers* group (fallback approvers), all created through the Table API and kept as `scripts/11-notifications-and-jobs.js`:
  - **Enrolment approved** / **Enrolment rejected** — record-based (*Send when: Record inserted or updated*), condition *Enrollment Status changes to Enrolled / Cancelled*, recipient = `employee`. Because they key off the status, the approval flow only has to update the status and the right email follows automatically.
  - **Upcoming session reminder** — *Send when: Event is fired* on `x_2186817_employ_0.session.reminder`; the job *ETCMS - Upcoming session reminders* (daily 06:00) queues one event per *Enrolled* employee for sessions starting within 3 days (`parm1` = start, `parm2` = session name).
  - **Certification expiry reminder** — *Event is fired* on `x_2186817_employ_0.cert.expiring`; the job *ETCMS - Certification expiry reminders* (daily 06:15) queues an event for every certification expiring within 30 days whose status is not Expired and moves *Active* ones to *Renewal Pending*.
- **Why:** Guide items 4.5 (1)–(3). The PDI has outbound SMTP disabled, so the evidence is the **System Mailboxes → Outbox** (`sys_email`, state *ready*), which shows exactly what would be sent. Scheduled Script Executions were used instead of scheduled flows because flows cannot be authored through the API (see the Flow Designer entry).
- **Learned:** *Send when* is the column `generation_type` (`engine` = record inserted/updated, `event` = event is fired, `triggered` = flow); the API default is `engine`, so an event notification created by API silently never fires until `generation_type=event`. Event names are limited to 40 characters. `${event.parm1}` and dot-walked fields (`${training_session.start_date}`) work in subject and body; `${URI_REF}` renders a link to the record. A recipient only receives email if their user record has *Notification = Enabled* **and** an active primary email device (`cmn_notif_device`).
- **Tested (TC-14/15/16, passed):** Status change Requested → Enrolled on ENR0001011 produced *Enrolment ENR0001011 approved: Analytics Workshop* to eric.schroeder@example.com; Requested → Cancelled produced *… not approved …*; both records reverted to Requested afterwards. Running the certification job produced three *Certification expiring* emails (Beth Anglin, Eric Schroeder, Abel Tuter) and set Beth's lapsed CSA from Active to Renewal Pending. The session job queued nothing for a 3-day horizon (next session 2026-11-10); run with a 14-day test horizon it produced reminders for Beth Anglin and David Miller.
- **Evidence:** `screenshots/notification-email-enrolment-approved.png`, `screenshots/notifications-list.png`, `screenshots/notification-outbox.png`
- **Data touched for the tests (not reverted):** Beth Anglin's manager set to Fred Luddy (needed by the approval flow); Fred Luddy and Don Goodliffe added to *Training Managers*; Luke Wilson and Beth Anglin set to *Notification = Enabled* with their primary email device re-activated; Beth Anglin's CSA certification now *Renewal Pending*. One stray outbox email (*Reminder: Analytics Workshop starts c88a08a1…*) was produced while the reminder notification was briefly misconfigured as record-based.

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-11-01 | Event `x_2186817_employ_0.certification.expiring` was silently truncated to 40 characters on insert | Renamed to `x_2186817_employ_0.cert.expiring` in the registry, the notification and the job | `sysevent_register.event_name` is a 40-char string; keep scoped event names short |
| 2026-11-01 | Event-based notifications never fired although the events were *processed* | `generation_type` was `engine` (API default); set to `event` | *Send when* is a real column, not derived from `event_name`; with `generation_type=engine` and `action_update=true` the notification fires on record update instead and `${event.parm1}` renders the notification sys_id |
| 2026-11-01 | No email for Luke Wilson / Beth Anglin even for a working notification | Their demo user records had *Notification = Disabled* and an inactive primary email device; enabled both | Check `sys_user.notification` and `cmn_notif_device` before blaming the notification |

## 2026-11-01 — Phase 4, Step 21: Reports (dashboard pending, browser-only)
- **What:** Five `sys_report` records in the app scope via the Table API, reproducible as `scripts/12-reports.js`: *Enrolments by Status* (donut, `enrollment_status`), *Courses by Category* (pie, `category`), *Session Distribution by Course* (bar, `course`), *Certifications by Status* (donut, `certification_status`) and *Upcoming Training Sessions* (list: `start_date > now`, not cancelled, ordered by start, 8 columns). Each renders in the report builder (`sys_report_template.do?jvar_report_id=…`).
- **Why:** Guide item 4.6 — the dashboard widgets. Keeping them as plain reports means they can also be exported, scheduled and embedded individually.
- **Learned:** A grouped chart report is `type` + `field` + a filter that ends in `^GROUPBY<field>`; `aggregate=COUNT`; list reports use `field_list`/`orderby`/`row_count`. On Zurich the classic `pa_dashboards` table is empty — dashboards are **Platform Analytics** records (`par_dashboard` → `par_dashboard_canvas` → `par_dashboard_widget`, each widget a macroponent with a large `component_props` JSON tied to `sys_ux_*` records), so the dashboard is assembled in the browser: exact steps in [manual-steps.md](manual-steps.md) §B.
- **Tested (TC-17 reports, passed):** Enrolments by Status renders 5 slices (7 completed, 3 enrolled, 2 requested, 1 waitlisted, 1 cancelled); Courses by Category 6 courses; Session Distribution by Course shows ServiceNow Fundamentals with 3 sessions (incl. the cancelled TC-11 one) and 1 each for the other courses; Certifications by Status 3 slices; Upcoming Training Sessions lists SN Fundamentals Batch 1, Analytics Workshop and SN Fundamentals Batch 2 in date order.
- **Evidence:** `screenshots/reports-list.png`, `screenshots/report-enrolments-by-status.png`, `screenshots/report-courses-by-category.png`, `screenshots/report-sessions-by-course.png`, `screenshots/report-certifications-by-status.png`, `screenshots/report-upcoming-sessions.png`
- **Data touched:** the TC-11 test session was given course *ServiceNow Fundamentals*, trainer *Abel Tuter*, location *Microsoft Teams* and status *Cancelled* so it no longer appears as "(empty)" in reports; delete it if six sessions are preferred.

## 2026-11-01 — Phase 4, Step 22: Flow Designer enrolment approval (prepared; build is browser-only)
- **What:** Flow Designer flows (`sys_hub_flow` + snapshots) have no authoring API, so the flow itself is not built yet. Everything around it is: the *Training Managers* fallback approver group (Fred Luddy, Don Goodliffe), Beth Anglin's manager (Fred Luddy) for the test, and the record-based *Enrolment approved* / *Enrolment rejected* notifications, which fire on the status change — the flow therefore only needs *Ask for Approval* + *Update Record* (no *Send Email* action, which would double-send). Click-by-click instructions and the TC-18 test plan are in [manual-steps.md](manual-steps.md) §A.
- **Why:** Guide item 4.4. Splitting "decide" (flow) from "notify" (notifications on the data) keeps the flow small and lets the same emails fire whether the status changes through the flow, the form or an import.
- **Learned:** Flow Designer stores a flow as `sys_hub_flow` with `sys_hub_flow_snapshot`, `sys_hub_action_instance`, `sys_hub_step_instance` and `sys_hub_flow_logic` rows wired by generated sys_ids and a compiled snapshot — the UI is the only supported authoring path (apart from update-set import of a flow built elsewhere).

## 2026-11-02 — Phase 4, Step 23: Flow Designer "ETCMS Enrolment Approval" built and tested (TC-18)
- **What:** Built the flow in Workflow Studio (Zurich's Flow Designer) through the Claude in Chrome extension, in the ETCMS scope, *Run as* System User (sys_id `e7871c39935c5b10803931697bba1091`). Trigger: *Course Enrollment created* where *Enrollment Status is Requested*. Logic: **If** *Employee ▸ Manager is not empty* → *Ask For Approval* (rule *Anyone approves*, user = Employee ▸ Manager) → **If** *Approval State is Approved* → *Update Record* (Enrollment Status = Enrolled) / **Else If** *Rejected or Cancelled* → *Update Record* (Cancelled). **Else** → *Ask For Approval* with group *Training Managers* and the same two branches. Activated; the record-based notifications from Step 20 send the approved / not-approved emails on the status change, so the flow has no *Send Email* action.
- **Why:** Guide item 4.4 — the last automation piece. Nesting the Approved/Rejected checks inside each branch is not stylistic: Flow Designer only exposes a step's data pills inside the block that contains the step, so a single top-level "approval state" check cannot see either *Ask For Approval* output.
- **Learned:** *Ask For Approval* reports **`cancelled`**, not `rejected`, in its *Approval State* output when the single approver rejects — the first rejection test completed the flow without touching the record. Found by turning on flow reporting (`com.snc.process_flow.reporting.level`; left at BASIC) and reading the step outputs in *Operations → Today's executions*; fixed by making both rejection branches match *Rejected OR Cancelled*. Impersonation for the test was done with `POST /api/now/ui/impersonate/<user>` (+ `X-UserToken`) and reversed by impersonating the admin sys_id. The classic flow URL (`$flow-designer.do`) redirects to Workflow Studio on Zurich.
- **Tested (TC-18, passed):** ENR0001016 (Beth Anglin, SN Fundamentals Batch 2, Requested) → approval record for Fred Luddy → approved as Fred (comment "Approved - Beth can attend Batch 2.") → status **Enrolled**, outbox *Enrolment ENR0001016 approved: SN Fundamentals Batch 2* to beth.anglin@example.com, flow context Complete. ENR0001020 → rejected as Fred → status **Cancelled**, outbox *Enrolment ENR0001020 not approved*. ENR0001017–0001019 were the diagnostic runs for the cancelled-vs-rejected finding; their approvals are Rejected and the records were set to Cancelled by hand to match.
- **Evidence:** `screenshots/flow-enrolment-approval.png` (diagram view), `screenshots/flow-approval-record.png` (approval as Fred Luddy), `screenshots/flow-enrollment-enrolled.png`, `screenshots/flow-enrollment-list-tc18.png`

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-11-02 | Top-level *If* could not reference *Approval State* from either *Ask For Approval* (pills greyed out) | Deleted it and nested If / Else If / Update Record inside each approval branch | Data pills are scoped to the enclosing If/Else block |
| 2026-11-02 | Rejection left the enrolment *Requested* although the approval was *Rejected* and the flow completed | Enabled flow reporting; execution details showed *Approval State = cancelled*; added *OR is Cancelled* to both Else If steps and re-activated | Ask For Approval's output on a rejection by the only approver is `cancelled` |
| 2026-11-02 | `sys_properties` update rejected (ACL) from the app-scoped API session | Set the property with a global-scope background script | Platform properties still need global scope even via the Table API |
| 2026-11-02 | Chrome extension renderer froze (screenshot timeouts) after heavy Workflow Studio transitions; `navigate` blocked by a *Leave site?* prompt after publish | Re-ran with `force`, waited 10–30 s before screenshots, recreated the tab when frozen | Next Experience pages need generous settle time under automation |

## 2026-11-02 — Phase 4, Step 24: Platform Analytics dashboard "Training & Certification Overview" (TC-19)
- **What:** Created the dashboard in the Platform Analytics library (*Create dashboard*, in-line editor, ETCMS scope; `par_dashboard` `ead120f193109b10803931697bba106c`), renamed its tab *Overview*, and added the five reports as widgets: *Enrolments by Status* (Donut), *Courses by Category* (Pie), *Session Distribution by Course* (Vertical bar), *Certifications by Status* (Donut) in a 2×2 grid and *Upcoming Training Sessions* (List - Simple, 8 columns, future sessions by start date) full-width underneath. Shared read-only with the *Training Managers* group. Reproducible as `scripts/13-dashboard-widgets.js`.
- **Why:** Guide item 4.6 — a single page for training managers. Platform Analytics is the only dashboard framework left on Zurich (the classic responsive `pa_dashboards` pages are gone).
- **Learned:** The editor's *Add new element → Data visualization → Saved Visualization* dialog froze the Chrome extension's renderer three times in a row, so the widgets were inserted through the tables: `par_dashboard` → `par_dashboard_tab` → `par_dashboard_canvas` (whose `layout` JSON must repeat every widget's sys_id, position, component id and props — without it the page is empty) → `par_dashboard_widget` (`component` = `sys_ux_macroponent` for Donut / Pie / Vertical bar / List - Simple, `component_props` = JSON with `dataSources` {table, filterQuery}, `groupBy` {field, isChoice} and `metrics` {COUNT}). Templates were copied from out-of-the-box widgets and re-pointed at the ETCMS tables. Sharing is a `par_dashboard_permission` row (group, `can_read`). Library URL: `/now/platform-analytics-workspace/pages/params/library/dashboards`.
- **Tested (TC-19, passed):** The dashboard renders all five widgets with live data — 19 enrolments (7 completed, 5 cancelled, 4 enrolled, 2 requested, 1 waitlisted), 6 courses by category, sessions per course (ServiceNow Fundamentals 3, others 1), 6 certifications (3 renewal pending, 2 active, 1 expired) and the three upcoming sessions in date order.
- **Evidence:** `screenshots/dashboard-training-overview.png`, `screenshots/dashboard-training-overview-list.png`

| Date | Issue | Resolution | Learning |
|------|-------|------------|----------|
| 2026-11-02 | `$pa_dashboards.do` → *Page not found* | Found the module target via `sys_app_module`: the Platform Analytics library URL | Classic dashboard pages are removed on Zurich |
| 2026-11-02 | *Saved Visualization* picker hung the browser tab (CDP screenshot timeouts, no page text) | Built the widgets via the `par_*` tables; browser used only to view/verify | Heavy UX-framework dialogs may not survive extension-driven automation |
| 2026-11-02 | Canvas `layout` PATCH returned 404 | PowerShell parsed `$canvas?` as a variable name; concatenated the URL instead | Quote or concatenate `?` after variables in PowerShell strings |

## 2026-11-02 — Housekeeping (approved by the owner)
- **What:** Deleted the TC-11 test session *TC-11 End Date validation* (no enrolments referenced it; six sessions remain), the two stray *Reminder: Analytics Workshop starts c88a08a1…* outbox emails from 2026-11-01 12:31, and the 11 orphan `sys_ui_bookmark` rows from Phase 3. All via the Table API after listing each set first.
- **Kept:** the five TC-18 enrolments for Beth Anglin (ENR0001016 Enrolled, ENR0001017–ENR0001020 Cancelled) and their approval records — they are the evidence for the approval flow; listed in HANDOFF as optional clean-up.

## 2026-11-02 — TC-18 test-data clean-up (approved by the owner)
- **What:** Deleted enrolments ENR0001017, ENR0001018, ENR0001019 and ENR0001020 (all Cancelled; the rejection and cancelled-vs-rejected diagnostic runs) and their four `sysapproval_approver` records via the Table API, after listing them first. Kept ENR0001016 (Enrolled through the approval flow) and its approved approval as evidence for TC-18.
- **Why:** The owner preferred a clean data set; one record is enough to show the approval path, and the rejection path is documented in the Step 23 entry and screenshots.
- **Result:** Course Enrollment holds 15 records; no approvals remain for the deleted enrolments. The dashboard's *Enrolments by Status* donut now shows 15 instead of 19 (4 fewer Cancelled). The flow contexts of the deleted runs remain in Workflow Studio's execution history.

