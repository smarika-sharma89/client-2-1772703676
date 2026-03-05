# Bill Approvals — Varicon Prototype

Generated from a Varicon discovery session.

## What this demonstrates
The prototype should focus on the highest-priority issue: the three-phase bill approval visibility and filter system. It should display a bills list view with enhanced status columns showing granular approval phase labels such as 'Awaiting First Approval', 'Awaiting Second Approval', and 'Awaiting Final Approval'. A working filter panel should allow users to filter bills by the specific approver whose action is currently pending, correctly resolving the multi-approver filter bug. Clicking into a bill should show an approval timeline or progress indicator displaying each approver, their status (approved or pending), and timestamps. The prototype should also mock up the in-app approval visibility panel as an alternative to email notifications. Secondary screens should include a Day Works docket detail view with an internal notes or audit log panel that allows users to add timestamped notes at 'submitted' status without modifying the docket, and a charge rates management screen where users can view, upload via spreadsheet, and amend their Day Works charge rates directly within Varicon.

## Features shown
- Additional granular approval statuses (e.g. 'Awaiting Second Approval', 'Awaiting Final Approval') to clearly indicate which phase a bill is in and who needs to act
- Fix the approval filter system so bills can be filtered by the specific approver whose action is still pending
- Ability to directly adjust the GST figure on a bill independently of the subtotal to match physical invoices
- Reliable automated bill syncing with Xero with clear error handling and status feedback
- Ability to add internal notes or audit log entries to submitted Day Works dockets without the note appearing on the docket itself
- User-facing interface to view, upload, and amend Day Works charge rates within Varicon
- WBS copy/duplicate functionality so the same WBS assignment can be applied across all lines of a bill with selective overrides
- In-application approval status visibility as an alternative to email notifications
- Lost time tracking and reporting for stand-down hours

## Running locally
```
npm install
npm run dev
```

## Note
This is a prototype with mock data. No real API calls are made.
