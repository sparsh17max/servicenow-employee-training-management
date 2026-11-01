# ETCMS — Claude Code project instructions

This repository documents a **ServiceNow portfolio application** built in a Personal Developer Instance.
Read `docs/HANDOFF.md` first — it is the full state of the project as of 2026-11-01.

## Instance
- PDI: `https://dev407572.service-now.com` (release: Zurich). Branded as fictional customer **Novatrix Solutions**.
- Application: *Employee Training and Certification Management*, scope **`x_2186817_employ_0`**.
- Tables: `x_2186817_employ_0_training_course`, `_training_session`, `_course_enrollment`, `_employee_certification`.
- Credentials: never commit them. Put `SN_INSTANCE`, `SN_USER`, `SN_PASS` in a local `.env` (git-ignored) and read them from there. Ask the user to create the file; do not type passwords.

## How to change the instance
1. **Preferred:** Table API from this machine with `.env` credentials — works for records *and* metadata
   (`sys_ui_policy`, `sys_ui_policy_action`, `sys_script_client`, `sys_script`, `sys_choice`, `sys_ui_section`, …).
   Example: `curl -s -u "$SN_USER:$SN_PASS" -H "Accept: application/json" "$SN_INSTANCE/api/now/table/x_2186817_employ_0_training_course"`.
2. Background scripts (`sys.scripts.do`) when server-side API is needed. **Run in GLOBAL scope** when touching platform tables
   (`sys_choice`, `sys_ui_*`, `sys_properties`, `db_image`); run in the **app scope** for the app's own tables and logic.
3. Browser (Chrome extension / Playwright) only for Flow Designer, Reports/Dashboards and screenshots.
   The PDI session expires; re-login is the user's job (never enter their password).
4. Every change gets: a dev-log entry (`docs/development-log.md`: What / Why / Learned / Evidence + issue table),
   a `CHANGELOG.md` line, test-case status in `docs/test-cases.md`, a screenshot in `screenshots/` when visual,
   and the Notion tracker row updated (see HANDOFF for IDs). Commit after each step.

## Conventions
- Choice values are lowercase snake_case (`in_person`, `renewal_pending`); never change them.
- Scripts in `scripts/` are idempotent and reproducible; add new ones with the next number.
- Date/Time: use `setDisplayValue()` / `sysparm_input_display_value=true` — plain `setValue` is UTC.
- Don't delete instance records without asking the user.
