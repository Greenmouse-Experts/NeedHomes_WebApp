Bank Account API — Frontend Integration Guide
Last updated: May 2026
Base URL: {{base_url}}/api
All responses are wrapped in the standard envelope:
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "path": "...",
  "timestamp": "..."
}
All protected endpoints require Authorization: Bearer <token> in the header.
1. Get All Banks
Use this to populate the bank dropdown before the user picks their bank.
GET /banks
No authentication required.
Response data:
[
  { "id": "...", "name": "GTBank", "code": "058" },
  { "id": "...", "name": "Access Bank", "code": "044" },
  ...
]
Store the code field — you need it when resolving the account number.
2. Resolve & Save Bank Account
Call this when the user submits their bank account details. It verifies the account number on Paystack, checks the name matches their KYC, and saves it.
POST /banks/resolve
Authorization: Bearer <user_token>
Content-Type: application/json
Request body:
{
  "accountNumber": "0123456789",
  "bankCode": "058"
}
Success response data:
{
  "bank_code": "058",
  "bank_name": "GTBank",
  "account_name": "John Doe",
  "masked_account": "****6789",
  "country": "NG"
}
⚠️ Change from before: account_number is no longer returned here. Use masked_account to show confirmation to the user (e.g. "Account ****6789 saved"). To display the full number, call GET /banks/me.
Error responses:
Status
Meaning
400
Account could not be verified on Paystack, or name does not match KYC
409
Bank account already set — user must contact support to change it

3. View Own Bank Account
Call this on the user's profile/settings page to display their saved bank account.
GET /banks/me
Authorization: Bearer <user_token>
Success response data:
{
  "bank_code": "058",
  "bank_name": "GTBank",
  "account_name": "John Doe",
  "account_number": "0123456789",
  "country": "NG"
}
account_number is the full number — display it directly. It is fetched securely from Paystack on demand and cached for 1 hour.
Error responses:
Status
Meaning
404
User has no bank account saved yet

4. Admin — View User's Bank Account (New endpoint)
Use this on the admin user detail page to display a user's full bank account details.
GET /admin/users/:userId/bank-account
Authorization: Bearer <admin_token>
Success response data:
{
  "bank_name": "GTBank",
  "bank_code": "058",
  "account_name": "John Doe",
  "account_number": "0123456789",
  "masked_account": "****6789"
}
Error responses:
Status
Meaning
404
User not found, or user has no bank account

5. Admin — Update User's Bank Account
Use this when admin needs to correct a user's bank account details.
PATCH /admin/users/:userId/bank-account
Authorization: Bearer <admin_token>
Content-Type: application/json
Request body:
{
  "accountNumber": "0987654321",
  "bankCode": "044",
  "bankName": "Access Bank"
}
bankName is optional — if omitted, it is looked up automatically from the bank code.
Success response data:
{
  "message": "Bank account details updated successfully.",
  "bank_name": "Access Bank",
  "account_name": "John Doe",
  "masked_account": "****4321",
  "bank_code": "044"
}
⚠️ Change from before: account_number is no longer returned in this response. To confirm the full updated details, call GET /admin/users/:userId/bank-account after the update.
Error responses:
Status
Meaning
400
Account could not be verified, or name does not match user's KYC
404
User not found

6. Admin — Reset User's Bank Account
Clears a user's bank account so they can re-submit their own details.
DELETE /admin/users/:userId/bank-account
Authorization: Bearer <admin_token>
Success response data:
{
  "message": "Bank account has been reset. The user can now submit new account details."
}
Error responses:
Status
Meaning
404
User not found, or user has no bank account on record

Summary of Changes
What changed
Impact
POST /banks/resolve no longer returns account_number
Update success handler to read masked_account instead
GET /banks/me still returns account_number
No change needed
PATCH /admin/.../bank-account no longer returns account_number
Update success handler — call GET to fetch full details if needed
GET /admin/users/:id/bank-account is a new endpoint
Wire this up on the admin user detail page
