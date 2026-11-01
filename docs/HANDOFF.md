# Project handoff — ETCMS (as of 2026-11-01)

Built so far in chat with Claude (browser-driven). Continue in Claude Code.

## Links
- PDI: https://dev407572.service-now.com — login is the user's; app scope `x_2186817_employ_0`
- Notion tracker: https://app.notion.com/p/c7f3ff077eb9414cb509f415dda3b6d3
  (data source `5fb1335b-8615-46e5-9597-f12f7dd01476`; properties: Task, Phase, Status[Not Started/In Progress/Testing/Completed], Priority, Start Date, Completion Date, Evidence, Concepts Learned, Issues Encountered)
- Project guide the user is following: ServiceNow Portfolio Project 2 (phases 1–5). Phase 5 = GitHub + Notion documentation.
- GitHub: repo not yet created/pushed. User wants a **different GitHub account for this project only** — configure per-repo `git config user.name` / `user.email` and the matching credential in this folder before the first push. Suggested repo name: `servicenow-employee-training-management`.

## Status
| Phase | Status |
|-------|--------|
| 1 Data model | ✅ 4 tables, 31 fields, 5 references, 25 choices |
| 2 Forms/lists/related lists/views | ✅ incl. HR + Training Manager views on Enrollment |
| Branding | ✅ Novatrix company (primary), logo in header (`db_image` novatrix-header.png), header colours, tab title |
| 3 Sample data + tests | ✅ 6 courses, 6 sessions, 14 enrollments, 6 certs; TC-01…09 passed |
| 4 Automation | 🟡 UI Policy done; Client Script, Business Rule, Flow, Notifications, Reports/Dashboard pending |
| 5 Portfolio docs | 🟡 docs written continuously; GitHub push pending |

Navigator Favorites already set for admin: ETCMS modules, Scripts - Background, Flow Designer, App Engine Studio.

## Phase 4 — remaining work (exact specs)

### 4.2 Client Script (not yet saved)
Table `x_2186817_employ_0_training_session`, Type **onSubmit**, UI Type All, Name *Validate End Date after Start Date*:
```javascript
function onSubmit() {
    var start = g_form.getValue('start_date');
    var end = g_form.getValue('end_date');
    if (!start || !end) return true;
    var startMs = new Date(start.replace(' ', 'T')).getTime();
    var endMs = new Date(end.replace(' ', 'T')).getTime();
    if (isNaN(startMs) || isNaN(endMs)) return true;
    if (endMs <= startMs) {
        g_form.clearMessages();
        g_form.showFieldMsg('end_date', 'End Date must be later than Start Date.', 'error');
        g_form.addErrorMessage('Session not saved: End Date must be later than Start Date.');
        return false;
    }
    return true;
}
```
Create via Table API: `POST /api/now/table/sys_script_client` with `{table, name, type:"onSubmit", ui_type:"10", active:true, script, description}` — run with the app scope selected (add header `X-UserToken` not needed for basic auth; scope is taken from the user's current application — set it via `PUT /api/now/ui/concoursepicker/application` or create through the UI). Test: TC-11.

### 4.3 Business Rule
Table `x_2186817_employ_0_course_enrollment`, **before** insert+update, Name *Completed requires Completion Date*, condition `enrollment_status=completed^completion_dateISEMPTY`:
```javascript
(function executeRule(current, previous /*null when async*/) {
    gs.addErrorMessage(gs.getMessage('An enrollment cannot be marked Completed until its Completion Date is populated.'));
    current.setAbortAction(true);
})(current, previous);
```
Test: TC-12 (UI save with status Completed and empty date must be rejected; also test via REST PATCH).

### 4.4 Flow Designer — Enrolment approval
- Trigger: Record **created** on Course Enrollment, condition Enrollment Status = Requested.
- Action: *Ask for Approval* → approver = Trigger ▸ Employee ▸ Manager (fallback: a "Training Manager" group if manager empty).
- If Approved: Update Record → Enrollment Status = Enrolled; Send Email (approval notification).
- If Rejected: Update Record → Enrollment Status = Cancelled; Send Email (rejection notice).
- Activate, then test by creating a Requested enrollment for a user who has a manager (e.g. Beth Anglin) and approving from *My Approvals*.

### 4.5 Notifications
1. Enrolment approved / rejected (from the flow or `sysevent_email_action` on Course Enrollment status change).
2. Upcoming session reminder: scheduled flow, daily, sessions starting in next 3 days, email enrolled employees.
3. Certification expiry reminder: scheduled flow, daily, `expiry_date` within 30 days and status != expired → email employee; optionally set status to Renewal Pending.

### 4.6 Reports + dashboard "Training & Certification Overview"
| Report | Table | Type | Group by |
|--------|-------|------|----------|
| Enrolments by Status | course_enrollment | Donut | enrollment_status |
| Courses by Category | training_course | Pie | category |
| Session Distribution | training_session | Bar | course (or delivery_mode) |
| Certifications by Status | employee_certification | Donut | certification_status |
| Upcoming Training Sessions | training_session | List | filter start_date > now, order by start_date |
Create via *Reports → Create New* (or `sys_report` records), then a dashboard with the five widgets. Screenshot for the portfolio.

### Phase 4 enhancement already logged
Course Enrollment has no display field → add `number` (String, auto-number prefix ENR, display=true) so records are not labelled "Created <timestamp>".

## Known issues / notes
- Instance time zone is America/Los_Angeles; Asia/Kolkata is not in the available-time-zone list.
- 11 orphan `sys_ui_bookmark` rows (titles starting "ETCMS ·", "Novatrix ·", "Scripts - Background", "Flow Designer") created via REST are not rendered by Next Experience; ask before deleting.
- `GlideSysAttachment.writeBase64()` silently fails from background scripts on this release; use the Attachment REST API.
- Basic Configuration UI16 page would not save while in app scope; set `sys_properties` from global.
- Demo user `joe.employee` does not exist in this PDI.

## Docs map
`README.md` · `docs/business-requirements.md` · `docs/architecture.md` · `docs/data-dictionary.md` · `docs/sample-data.md` · `docs/test-cases.md` · `docs/development-log.md` · `CHANGELOG.md` · `scripts/` (01–07 + README) · `brand/` · `screenshots/`
