# Manual steps (browser only)

> **Status 2026-11-02: all three sections are done.** §A was built in Workflow Studio with the Claude in Chrome extension (TC-18 ✅); §B was created in the Platform Analytics library and its widgets inserted via the `par_*` tables because the in-line editor froze the browser renderer (TC-19 ✅, reproducible as `scripts/13-dashboard-widgets.js`); §C deletions were approved and executed. The steps are kept as the reference procedure for rebuilding on a fresh PDI.

Two Phase 4 items cannot be authored through the REST/Table API on this release and must be clicked together in the PDI.
Everything they depend on is already in place (see `docs/development-log.md`, 2026-11-01 entries).

## A. Flow Designer — "ETCMS Enrolment Approval" (HANDOFF 4.4)

Already prepared for you:
- Group **Training Managers** (members Fred Luddy, Don Goodliffe) — fallback approver.
- **Beth Anglin** now has manager **Fred Luddy** (for the test).
- Notifications **Enrolment approved** / **Enrolment rejected** fire automatically when *Enrollment Status* changes to *Enrolled* / *Cancelled*, so the flow only needs to update the status — no *Send Email* action is required (adding one would double-send).

Steps (All → Flow Designer, application scope **Employee Training and Certification Management**):
1. **New → Flow**. Name `ETCMS Enrolment Approval`, Application = the ETCMS scope, Run As = *System User*. Submit.
2. **Trigger**: *Created* → Table **Course Enrollment [x_2186817_employ_0_course_enrollment]** → Condition *Enrollment Status is Requested*. Done.
3. **Action → Flow Logic → If**: *Trigger ▸ Course Enrollment Record ▸ Employee ▸ Manager* **is not empty**.
   - Inside the **If**: **Action → ServiceNow Core → Ask for Approval**. Record = *Trigger ▸ Course Enrollment Record*. Rules: *Approve when* **Anyone approves** → *Users* = *Trigger ▸ Course Enrollment Record ▸ Employee ▸ Manager*. Done.
   - **Else**: **Ask for Approval** again, Record = trigger record, *Approve when* **Anyone approves** → *Groups* = **Training Managers**. Done.
   (Simpler alternative if you prefer one action: a single Ask for Approval with *Users* = Employee ▸ Manager **and** *Groups* = Training Managers, rule "Anyone approves".)
4. **Inside each branch** (data pills from a step inside an If are not available outside it): **Flow Logic → If**: *2 ▸ Approval State* (the branch's own Ask for Approval; *8 ▸* in the else branch) **is** `Approved`.
   - **Action → ServiceNow Core → Update Record**: Record = *Trigger ▸ Course Enrollment Record*, Table auto-fills, Fields: **Enrollment Status = Enrolled**. Done.
5. **Else If** approval state **is** `Rejected` **OR is** `Cancelled` (Ask for Approval reports *cancelled* when the single approver rejects) → **Update Record**: **Enrollment Status = Cancelled**.
6. **Save**, then **Activate** (top right). Confirm the flow shows *Active*.

Test (TC-18):
1. All → ETCMS → Course Enrollments → **New**: Employee *Beth Anglin*, Training Session *SN Fundamentals Batch 2*, Enrollment Status *Requested* → Submit (it gets number ENR0001015 or next).
2. Open the record's **Approvers** related list (or *Self-Service → My Approvals* impersonating Fred Luddy): one approval for Fred Luddy, state *Requested*.
3. Set the approval to **Approved** → the enrollment flips to *Enrolled* and *System Mailboxes → Outbox* shows *Enrolment ENR… approved: SN Fundamentals Batch 2* to beth.anglin@example.com.
4. Repeat with a second request and **Reject** it → status *Cancelled*, rejection email in the outbox.
5. Screenshots to take: the flow canvas (`screenshots/flow-enrolment-approval.png`), the approval record (`screenshots/flow-approval-record.png`), the enrollment after approval (`screenshots/flow-enrollment-enrolled.png`).
6. Record the results in `docs/test-cases.md` (TC-18), the dev log, the changelog and the Notion row *Build Flow Designer workflow*.

Optional (HANDOFF 4.5 wording): the two daily reminders currently run as **Scheduled Script Executions** (`System Definition → Scheduled Jobs → ETCMS - …`). If you want them as *scheduled flows* instead: Flow Designer → New → Flow, trigger **Daily** 06:00, action **Look Up Records** (Training Session, *Start date on or after Today AND on or before 3 days from now AND Session Status is not Cancelled*), **For Each** → **Look Up Records** (Course Enrollment, Training Session = item, Status = Enrolled) → **For Each** → **Send Email** to *Employee ▸ Email*. Then deactivate the matching scheduled job.

## B. Platform Analytics dashboard — "Training & Certification Overview" (HANDOFF 4.6)

The five reports exist (`scripts/12-reports.js`): *Enrolments by Status*, *Courses by Category*, *Session Distribution by Course*, *Certifications by Status*, *Upcoming Training Sessions*. On Zurich, dashboards are Platform Analytics UX pages (`par_dashboard` + macroponents), which is why they are built in the browser:

1. All → **Dashboards** (Platform Analytics) → **+ New dashboard**. Name `Training & Certification Overview`, Description `ETCMS overview: enrolments, courses, sessions and certifications`. Create.
2. **Edit** → **Add widget** → **Reports** (or *Data visualizations → Reports*) → search the title → add, for each of the five reports. Suggested layout: four charts in a 2 × 2 grid, the *Upcoming Training Sessions* list full-width underneath.
3. Rename widget headers if the report title is not picked up. **Save**.
4. **Share** → *Groups* **Training Managers** (and optionally *Everyone* for the portfolio demo).
5. Screenshot the dashboard to `screenshots/dashboard-training-overview.png`, then update `docs/development-log.md`, `CHANGELOG.md`, `docs/test-cases.md` (TC-19) and the Notion row *Create reports and dashboard* → Completed.

If the in-line editor's *Data visualization* / *Saved Visualization* dialog hangs the browser (it did on 2026-11-02), run `scripts/13-dashboard-widgets.js` in the app scope instead: it creates the dashboard, tab, canvas layout, the five widgets and the Training Managers share.

## C. Housekeeping (done 2026-11-02 — all three deletions approved by the owner)

- Test session **TC-11 End Date validation** (sys_id `5008c86d935cd710803931697bba1040`) — created by the TC-11 positive control; now set to *Cancelled* with course *ServiceNow Fundamentals* so it looks like real data. Delete it if you prefer exactly six sessions.
- One stray outbox email *Reminder: Analytics Workshop starts c88a08a1…* (`sys_email`, 2026-11-01 12:31) produced while the reminder notification was briefly misconfigured. Harmless; delete for a clean outbox.
- 11 orphan `sys_ui_bookmark` rows from Phase 3 (see HANDOFF) — still pending your decision.
