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
