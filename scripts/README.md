# Background scripts used during development

All scripts are **idempotent** (safe to re-run) and were executed from *System Definition → Scripts - Background* in **global** scope, because scoped applications cannot write to platform tables such as `sys_choice`, `sys_ui_section` and `sys_ui_list` (cross-scope access policy).

| Script | Purpose | Phase |
|--------|---------|-------|
| `01-create-choices.js` | Inserts the 25 choice values for the 7 choice fields | 1 |
| `02-form-layouts.js` | Sets the default-view form section field order for all four tables | 2 |
| `03-list-layouts.js` | Sets the default-view list columns for all four tables | 2 |
| `04-related-lists-and-views.js` | Adds related lists (Course→Sessions, Session→Enrollments) and the HR / Training Manager form views on Course Enrollment | 2 |

The same results can be achieved through the UI (*Configure → Form Layout / List Layout / Related Lists*, and the view selector); the scripts are kept here as evidence and so the configuration can be reproduced on a fresh PDI.
| `05-branding-properties.js` | Sets UI16 header properties (caption, tab title, colours, banner image name) and marks Novatrix Solutions as the primary company | Branding |
| `06-upload-logo-browser.js` | Browser-console helper that uploads the logo PNG to the `db_image` record through the Attachment REST API | Branding |
| `07-sample-data.js` | Creates the Phase 3 sample data: 6 courses, 6 sessions, 14 enrollments, 6 certifications (idempotent) — run in the **app** scope | 3 |
| `08-client-script-end-date.js` | Creates the onSubmit Client Script *Validate End Date after Start Date* on Training Session (idempotent) — run in the **app** scope; the header comment gives the equivalent Table API call | 4 |
| `09-business-rule-completed-date.js` | Creates the before insert/update Business Rule *Completed requires Completion Date* on Course Enrollment (idempotent) — run in the **app** scope | 4 |
| `10-enrollment-number-field.js` | Adds the ENR auto-number (sys_number, display field, back-fill, layouts) to Course Enrollment (idempotent) — run in the **app** scope | 4 |
| `11-notifications-and-jobs.js` | Creates the Training Managers group, two events, four notifications and two daily reminder jobs (idempotent) — run in the **app** scope | 4 |
