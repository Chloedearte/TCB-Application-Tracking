# TCB Candidate Journey Portal — Product Brief for Codex

## 1. Product Overview

Build a web-based **TCB Candidate Journey Portal** for shortlisted candidates of the **The Complete Banker (TCB) Programme**.

The purpose of the app is to help high-volume graduate candidates understand where they are in the hiring journey. Candidates should be able to log in securely using their email address and an OTP, then view their personal journey map with the current stage and status.

The admin/hiring team should be able to update candidate statuses individually or in bulk using CSV/Excel upload.

This app is **only for TCB shortlisted candidates**. It should not support multiple programmes in the first version.

---

## 2. Primary Users

### Candidate
Shortlisted TCB candidate who wants to check their current hiring status.

### Admin / Hiring Team
Recruiter or selected hiring team member who manages candidate status updates.

Admin access should support:
- Main recruiter
- Selected hiring team members

---

## 3. Core Principles

1. **Privacy-first**
   - Candidate identity is based on unique email address.
   - Candidate login requires OTP sent to their email.
   - Candidates should only see their own status.

2. **Simple candidate experience**
   - Candidate sees only stage name, status and simple status-based message.
   - Detailed next-step instructions will continue to be sent separately by the hiring team via email.

3. **High-volume admin workflow**
   - Admin must be able to update one candidate manually.
   - Admin must also be able to bulk upload/update candidates using CSV/Excel.

4. **Modern and professional design**
   - Sleek dashboard style.
   - CIMB-inspired colour palette.
   - No CIMB logo.
   - Youthful / Gen Z but still professional tone.

---

## 4. Authentication

### Candidate Login
Flow:
1. Candidate enters email address.
2. System checks whether the email exists in the shortlisted candidate database.
3. If email exists, system sends OTP to the candidate’s email.
4. Candidate enters OTP.
5. If OTP is valid, candidate can access their personal journey map.

Privacy-safe error message:
> We could not verify this email. Please contact the hiring team if you believe this is incorrect.

Do not reveal whether an email is or is not in the candidate database in a way that creates a privacy issue.

### Admin Login
Admin should log in with secure email/password or organisation-auth method depending on deployment.

For prototype/MVP, email/password admin login is acceptable.

---

## 5. Candidate Data Model

Each candidate should store:

- `id`
- `full_name`
- `email` — unique identifier
- `university`
- `degree_field`
- `current_stage`
- `current_status`
- `notes` — admin-only
- `last_updated_at`
- `created_at`

Email must be unique.

---

## 6. Candidate Journey Stages

The journey map should always display all future stages, even if the candidate has not reached them yet.

### Stage 1
**Prelim Interview**

### Stage 2A
**Pre-Qualifying Assessment — Part 1: Group Case Study**

### Stage 2B
**Pre-Qualifying Assessment — Part 2: Structured Interview**

Candidate must pass Part 1 before proceeding to Part 2.

### Stage 3A
**Assessment Day — Part 1: Group Case Simulation**

### Stage 3B
**Assessment Day — Part 2: Panel Interview**

Candidate must pass Part 1 before proceeding to Part 2.

### Stage 4
**Final Interview**

### Stage 5
**Final Outcome**

---

## 7. Approved Status Values

Use the following status values:

- `Passed`
- `Scheduling`
- `Scheduled`
- `Pending Review`
- `KIV`
- `Not Selected`
- `Offer`

Recommended display logic:

| Status | Candidate-facing meaning |
|---|---|
| Passed | Candidate has cleared this stage |
| Scheduling | Hiring team is arranging the next step |
| Scheduled | Candidate has been scheduled for the stage |
| Pending Review | Candidate has completed the stage and is awaiting review |
| KIV | Candidate is being kept under further review |
| Not Selected | Candidate will not proceed further |
| Offer | Candidate has reached offer stage |

---

## 8. Candidate View Requirements

Candidate dashboard should include:

1. Welcome message with candidate name.
2. Disclaimer:
   > This portal is for status tracking only. Detailed instructions, venue, schedule and preparation notes will be sent separately by the hiring team via email.
3. Full TCB journey map.
4. Current stage highlighted.
5. Each stage displays:
   - Stage name
   - Stage status
6. Status-based message card.

Do not show:
- Admin notes
- Internal reviewer comments
- Other candidates’ data
- Assessment scores
- Interview feedback

---

## 9. Status-Based Candidate Messages

Suggested messages:

### Scheduling
> Our hiring team is arranging the next step. Please keep an eye on your email for further updates.

### Scheduled
> You have been scheduled for this stage. Please refer to the email from the hiring team for full details.

### Pending Review
> You have completed this stage. Your outcome is currently being reviewed.

### KIV
> Your application is currently under further review. We will update you once there is a further decision.

### Passed
> You have passed this stage. Please keep an eye on your email for the next step.

### Not Selected
> Thank you for your interest in the TCB Programme. Please refer to the communication from the hiring team for further details.

### Offer
> Congratulations. You have reached the offer stage. The hiring team will contact you with further details.

---

## 10. Admin Dashboard Requirements

Admin dashboard should include:

### Overview Metrics
- Total shortlisted candidates
- Number by current stage
- Number by status
- Pending review count
- KIV count
- Not selected count
- Offer count

### Candidate Table
Columns:
- Full name
- Email
- University
- Degree / field of study
- Current stage
- Current status
- Last updated date

### Filters
- Search by name/email
- Filter by current stage
- Filter by current status
- Filter by university

### Admin Actions
- Add candidate
- Edit candidate
- Update current stage
- Update current status
- Add admin-only notes
- Bulk upload/update
- Export candidate list

---

## 11. Individual Candidate Update Flow

Admin should be able to:

1. Search candidate by email or name.
2. Open candidate profile.
3. View candidate details.
4. Update:
   - Current stage
   - Current status
   - Notes
5. Save update.
6. System updates `last_updated_at`.

Candidate sees the updated status after login.

---

## 12. Bulk Upload / Update Flow

Admin should be able to upload CSV or Excel.

System should:
1. Read file.
2. Match records by unique email.
3. Validate current stage.
4. Validate current status.
5. Show preview before applying update.
6. Highlight invalid rows.
7. Allow admin to download error report.
8. Apply valid updates.

### Required Upload Template

```csv
email,full_name,university,degree_field,current_stage,current_status,notes
amira.tan@email.com,Amira Tan,University of Malaya,Business Analytics,Pre-Qualifying Assessment Part 1,Scheduled,Email sent separately
jason.lim@email.com,Jason Lim,Monash University Malaysia,Banking & Finance,Pre-Qualifying Assessment Part 1,Pending Review,Awaiting review
```

---

## 13. Design Direction

Style:
- Sleek dashboard
- Modern, minimal, clean
- Youthful / Gen Z but still professional
- CIMB-inspired colours without logo

Suggested colour palette:
- Deep burgundy / wine
- Bright red accent
- Warm gold accent
- Soft cream background
- White cards
- Dark charcoal text

Candidate view should feel reassuring and polished.
Admin view should feel efficient and operational.

---

## 14. Suggested Tech Stack

Recommended:
- React or Next.js
- Firebase Authentication or custom OTP flow
- Firebase Firestore for candidate data
- Firebase Cloud Functions for OTP/email workflow
- Firebase Hosting
- Firebase Storage for uploaded CSV/Excel files, if needed

Alternative:
- Next.js + Supabase
- PostgreSQL database
- Email provider such as SendGrid, Postmark, Resend or AWS SES

---

## 15. Suggested Firestore Collections

### `candidates`
```json
{
  "full_name": "Amira Tan",
  "email": "amira.tan@email.com",
  "university": "University of Malaya",
  "degree_field": "Business Analytics",
  "current_stage": "Pre-Qualifying Assessment Part 1",
  "current_status": "Scheduled",
  "notes": "Email sent separately by hiring team.",
  "last_updated_at": "2026-06-14T10:15:00+08:00",
  "created_at": "2026-06-01T09:00:00+08:00"
}
```

### `stage_history`
```json
{
  "candidate_email": "amira.tan@email.com",
  "stage": "Pre-Qualifying Assessment Part 1",
  "status": "Scheduled",
  "updated_by": "recruiter@email.com",
  "updated_at": "2026-06-14T10:15:00+08:00"
}
```

### `otp_requests`
```json
{
  "email": "amira.tan@email.com",
  "otp_hash": "hashed_otp_value",
  "expires_at": "2026-06-14T10:25:00+08:00",
  "used": false,
  "created_at": "2026-06-14T10:15:00+08:00"
}
```

---

## 16. Security and Privacy Requirements

- Candidates can only access their own record.
- Admin-only notes must never appear on candidate dashboard.
- OTP must expire, recommended 5–10 minutes.
- Rate-limit OTP requests.
- Avoid revealing whether an email is in the database through overly specific errors.
- Log admin updates.
- Restrict admin dashboard to approved users only.
- Do not store plain OTP values; store hashed OTP only.

---

## 17. MVP Scope

Build these screens first:

1. Candidate email OTP login
2. Candidate disclaimer page / message
3. Candidate journey map
4. Admin dashboard
5. Individual candidate update form
6. Bulk upload/update page
7. CSV validation preview

---

## 18. Future Enhancements

Possible later features:
- Automated email notification when status changes
- Candidate RSVP confirmation
- Event schedule display
- Interview slot selection
- Candidate document upload
- Internal assessment scoring dashboard
- Candidate communication log
- Reminder email automation
- Analytics by stage conversion rate
- KIV ageing tracker
- Export report for leadership update

---

## 19. Codex Build Instruction

Build a responsive web app based on this product brief.

Start with:
- Next.js or React front end
- Firebase backend
- Candidate OTP login flow
- Firestore candidate data
- Admin dashboard
- CSV/Excel upload validation
- Role-based access control

Use the HTML prototype as the visual and interaction reference.

Prioritise:
1. Privacy and role-based access
2. Clean candidate journey map
3. Simple admin update workflow
4. Bulk upload validation
5. Mobile-friendly layout
