# Test Cases

| ID | Test | Steps | Expected result | Actual result | Status |
|----|------|-------|-----------------|---------------|--------|
| TC-01 | Create a new course | Training Courses → New → fill fields → Save | Record saved, appears in list | Record saved; list shows configured columns (2026-10-30); re-verified with full sample data (2026-10-31) | ✅ |
| TC-02 | Create a session | Training Sessions → New → pick Course | Course reference lookup shows courses | Autocomplete returned ServiceNow Fundamentals (2026-10-30) | ✅ |
| TC-03 | Select a trainer | On session form, pick Trainer | Existing sys_user can be selected | Abel Tuter selectable from sys_user (2026-10-30) | ✅ |
| TC-04 | Create an enrollment | Course Enrollments → New | Employee and Session references work | Enrollment for Beth Anglin saved (2026-10-30); re-verified with full sample data (2026-10-31) | ✅ |
| TC-05 | Course related list | Open a course record | Its sessions appear in related list | Training Sessions related list shows SN Fundamentals Batch 1 (2026-10-30); re-verified with full sample data (2026-10-31) | ✅ |
| TC-06 | Session related list | Open a session record | Its enrollments appear in related list | Course Enrollments related list shows Beth Anglin (2026-10-30); re-verified with full sample data (2026-10-31) | ✅ |
| TC-07 | Create from related list | Session → Enrollments related list → New | Training Session auto-populated | Training Session pre-populated with SN Fundamentals Batch 1 (2026-10-30) | ✅ |
| TC-08 | Create a certification | Employee Certifications → New | Employee reference works | Certification form opens; Employee reference resolved; URL field renders as link (2026-10-31) | ✅ |
| TC-09 | Filter by status | Enrollment list → filter Enrollment Status = Enrolled | Only matching records shown | Filter Enrollment Status = Completed returned 7 of 14 records (2026-10-31) | ✅ |
| TC-10 | Virtual session location (Phase 4) | Set Delivery Mode = Virtual | Location no longer mandatory | | ⬜ |
| TC-11 | End date validation (Phase 4) | End Date < Start Date → Submit | Submission blocked with message | | ⬜ |
| TC-12 | Completed without date (Phase 4) | Status = Completed, no Completion Date → Save | Server aborts save with error | | ⬜ |
