# Changelog

## [Unreleased]
### Added
- 2026-10-30 — Scoped application created in App Engine Studio with default roles and logo (Phase 1, Step 1).
- 2026-10-30 — Training Course, Training Session, Course Enrollment, Employee Certification tables with 31 fields, 5 reference relationships and 25 choice values (Phase 1, Steps 2–5). Phase 1 complete.
### Changed
- 2026-10-30 — Application renamed to "Employee Training and Certification Management" (ampersand was HTML-encoded in the UI).
- 2026-10-30 — Phase 2 complete: form layouts, list layouts, Course→Sessions and Session→Enrollments related lists, HR and Training Manager views on Course Enrollment. First sample records (TRN001, SN Fundamentals Batch 1, one enrollment). Scripts added under `scripts/`.
- 2026-10-31 — Instance branded for fictional customer **Novatrix Solutions**: primary company record, logo assets under `brand/`, UI16 header caption/title/colours/banner image. Scripts 05–06 added.
- 2026-10-31 — Phase 3 complete: sample data (6 courses, 6 sessions, 14 enrollments, 6 certifications), TC-01…09 passed, navigator favourites configured. `docs/sample-data.md` and `scripts/07-sample-data.js` added.
- 2026-11-01 — Project handed over to Claude Code: `CLAUDE.md`, `docs/HANDOFF.md`, `.env.example` added. Phase 4 UI Policy "Location is mandatory unless the session is Virtual" created (action: location mandatory, reverse if false).
- 2026-11-01 — Phase 5: public GitHub repository published at https://github.com/sparsh17max/servicenow-employee-training-management (one commit per phase, author line in README).
- 2026-11-01 — Phase 4: Client Script *Validate End Date after Start Date* (onSubmit, Training Session) created via Table API in the app scope; `scripts/08-client-script-end-date.js` added. TC-11 passed in headless Chrome.
- 2026-11-01 — Phase 4: Business Rule *Completed requires Completion Date* (before insert/update, Course Enrollment) created via Table API; `scripts/09-business-rule-completed-date.js` added. TC-12 passed via REST and UI.
- 2026-11-01 — Phase 4 enhancement: Course Enrollment gets an auto-numbered display field `number` (ENR0001001…), existing records back-filled, Number first on forms and list; `scripts/10-enrollment-number-field.js` added. TC-13 passed.
- 2026-11-01 — Phase 4: notifications *Enrolment approved*, *Enrolment rejected* (record-based), *Upcoming session reminder*, *Certification expiry reminder* (event-based) with events, two daily Scheduled Script Executions and the *Training Managers* group; `scripts/11-notifications-and-jobs.js` added. TC-14…16 passed (outbox evidence; SMTP is off on the PDI).
- 2026-11-01 — Phase 4: five dashboard reports (*Enrolments by Status*, *Courses by Category*, *Session Distribution by Course*, *Certifications by Status*, *Upcoming Training Sessions*) created via Table API; `scripts/12-reports.js` added. TC-17 passed.
- 2026-11-01 — `docs/manual-steps.md` added: browser-only steps for the Flow Designer enrolment approval (prerequisites done: Training Managers group, Beth Anglin's manager, status-driven notifications) and the Platform Analytics dashboard.
- 2026-11-02 — Phase 4: Flow Designer flow *ETCMS Enrolment Approval* built in Workflow Studio (trigger Course Enrollment created with status Requested; manager approval with *Training Managers* fallback; Approved → Enrolled, Rejected/Cancelled → Cancelled) and activated. TC-18 passed end to end (approve and reject as Fred Luddy). Flow reporting level set to BASIC.
- 2026-11-02 — Phase 4: Platform Analytics dashboard *Training & Certification Overview* with the five reports as widgets, shared with *Training Managers*; `scripts/13-dashboard-widgets.js` added. TC-19 passed. Phase 4 complete.
- 2026-11-02 — Housekeeping: TC-11 test session, two stray reminder outbox emails and 11 orphan `sys_ui_bookmark` rows deleted (approved by the owner). Test enrolments ENR0001016–ENR0001020 from TC-18 kept as data.
- 2026-11-02 — TC-18 clean-up: ENR0001017–ENR0001020 (rejection/diagnostic runs) and their four approval records deleted; ENR0001016 kept. 15 enrolments remain.
