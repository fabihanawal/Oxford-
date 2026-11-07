# Security Specification: Oxford Model School Admission Portal

## 1. Data Invariants
1. **Identity & Auth Invariant**: Every admission application submitted must have `applicantUid == request.auth.uid` and `guardianEmail == request.auth.token.email`. An applicant cannot submit on behalf of an arbitrary unauthenticated UID or someone else's email.
2. **Access Control (ABAC)**:
   - Applicants/Guardians can create an application with initial status `pending`.
   - Applicants/Guardians can only view (`get` / `list`) their own applications (`resource.data.applicantUid == request.auth.uid`).
   - The verified administrator (`request.auth.token.email == 'rstsbd@gmail.com' && request.auth.token.email_verified == true` or listed in `/admins/$(request.auth.uid)`) can view, list, and update status (`confirmed` / `rejected`), `adminRemarks`, and `interviewDate`.
   - Regular applicants cannot elevate their status to `confirmed` or edit other applicants' records.
3. **Boundaries & Integrity**:
   - String sizes strictly bounded (`<= 100` for names, `<= 30` for phone/class, `<= 500` for remarks).
   - Class must belong to valid classes: `['Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']`.
   - Status transitions can only be made by authorized administrators.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Write**: An unauthenticated user tries to create an admission application. (Expected: DENY)
2. **UID Spoofing**: An authenticated user with UID `user_A` submits an application with `applicantUid: 'user_B'`. (Expected: DENY)
3. **Email Spoofing**: An authenticated user sets `guardianEmail: 'rstsbd@gmail.com'` while logged in as another email. (Expected: DENY)
4. **Self-Confirmation Attack**: An applicant creates an application with `status: 'confirmed'` instead of `pending`. (Expected: DENY)
5. **Privilege Escalation**: An applicant attempts to update their own application's status to `confirmed`. (Expected: DENY)
6. **Malicious Admin Promotion**: A regular user writes to `/admins/{uid}` to make themselves an admin. (Expected: DENY)
7. **Cross-User Snooping**: User `user_A` tries to read an application belonging to `user_B`. (Expected: DENY)
8. **Denial of Wallet Payload**: An attacker submits a 2MB string payload for student name or address. (Expected: DENY)
9. **Illegal Class Enum**: Submitting `admissionClass: 'Class 12'` which is outside the school's Nursery-to-5 offerings. (Expected: DENY)
10. **ID Path Variable Poisoning**: A user injects script tags or path traversal into document ID. (Expected: DENY)
11. **Shadow Key Injection**: Submitting undeclared fields like `isPaid: true, bypassReview: true`. (Expected: DENY)
12. **Unauthorized Record Deletion**: A user attempts to delete submitted official admission records. (Expected: DENY)
