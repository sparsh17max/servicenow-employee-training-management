# Business Requirements

## Scenario
An organisation of ~300 employees. HR / Learning & Development currently manages training courses, sessions, registrations, completions and certifications via spreadsheets and email.

## Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| BR-01 | Maintain a catalogue of training courses with category, difficulty and duration | Must |
| BR-02 | Schedule training sessions for a course with a trainer, dates, delivery mode and capacity | Must |
| BR-03 | Register employees for sessions and track enrolment status | Must |
| BR-04 | Record completion date and result for each enrolment | Must |
| BR-05 | Maintain employee certification records with issue/expiry dates and status | Must |
| BR-06 | View all sessions for a course and all enrolments for a session | Must |
| BR-07 | Enrolment requests are approved by the employee's manager | Should |
| BR-08 | Notify employees on approval/rejection, upcoming sessions and certification expiry | Should |
| BR-09 | Dashboard of enrolments, courses, sessions and certifications | Should |
| BR-10 | Location is not required for virtual sessions | Could |

## Out of scope (v1)
- Integration with external LMS platforms.
- Payment / budgeting for training.
- A separate Trainer table (trainers are `sys_user` records).
