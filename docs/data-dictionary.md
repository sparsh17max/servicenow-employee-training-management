# Data Dictionary

Table names are prefixed with the application scope `x_2186817_employ_0_`.

## Training Course (`training_course`)
| Field label | Column name | Type | Configuration |
|-------------|-------------|------|---------------|
| Course Name | `course_name` | String (100) | Display field |
| Course Code | `course_code` | String (40) | e.g. TRN001 |
| Description | `description` | String (4000) | |
| Category | `category` | Choice | technical, compliance, leadership, communication |
| Difficulty Level | `difficulty_level` | Choice | beginner, intermediate, advanced |
| Duration (Hours) | `duration_hours` | Integer | |
| Active | `active` | True/False | Default: true |

## Training Session (`training_session`)
| Field label | Column name | Type | Configuration |
|-------------|-------------|------|---------------|
| Session Name | `session_name` | String (100) | Display field |
| Course | `course` | Reference | → Training Course |
| Trainer | `trainer` | Reference | → User [sys_user] |
| Start Date | `start_date` | Date/Time | |
| End Date | `end_date` | Date/Time | |
| Delivery Mode | `delivery_mode` | Choice | in_person, virtual, hybrid |
| Location | `location` | String (255) | |
| Capacity | `capacity` | Integer | |
| Session Status | `session_status` | Choice | planned, open, completed, cancelled |

## Course Enrollment (`course_enrollment`)
| Field label | Column name | Type | Configuration |
|-------------|-------------|------|---------------|
| Employee | `employee` | Reference | → User [sys_user] |
| Training Session | `training_session` | Reference | → Training Session |
| Enrollment Date | `enrollment_date` | Date | |
| Enrollment Status | `enrollment_status` | Choice | requested, enrolled, waitlisted, completed, cancelled |
| Completion Date | `completion_date` | Date | |
| Result | `result` | Choice | not_assessed, pass, fail |
| Feedback | `feedback` | String (4000) | |

## Employee Certification (`employee_certification`)
| Field label | Column name | Type | Configuration |
|-------------|-------------|------|---------------|
| Employee | `employee` | Reference | → User [sys_user] |
| Certification Name | `certification_name` | String (100) | Display field |
| Issuing Organisation | `issuing_organisation` | String (100) | |
| Credential ID | `credential_id` | String (100) | |
| Issue Date | `issue_date` | Date | |
| Expiry Date | `expiry_date` | Date | |
| Certification Status | `certification_status` | Choice | active, expired, renewal_pending |
| Verification URL | `verification_url` | URL | |

System fields (`sys_id`, `sys_created_on`, `sys_created_by`, `sys_updated_on`, `sys_updated_by`, `sys_mod_count`) are added automatically.
