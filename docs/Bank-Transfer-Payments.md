Frontend Integration Guide — Bank Transfer Payments
Overview
There are three bank transfer payment scenarios. Each follows the same Paystack virtual-account flow: initialize → user transfers → webhook confirms → poll for status.
All amounts are in kobo (₦1 = 100 kobo). All endpoints require a valid JWT Authorization: Bearer <token> header unless stated otherwise.
Payment Flow (applies to all three scenarios)
Frontend                     Backend                    Paystack
   │                             │                          │
   │── POST /initialize ────────>│                          │
   │                             │── initializeTransaction >│
   │                             │<── virtual account ──────│
   │<── { reference, account } ──│                          │
   │                             │                          │
   │  [show virtual account]     │                          │
   │  [user makes bank transfer] │                          │
   │                             │                          │
   │                             │<── charge.success ───────│ (webhook)
   │                             │  [process payment]       │
   │                             │                          │
   │── GET status/poll ─────────>│                          │
   │<── { status: "paid" } ──────│                          │
Scenario 1: Full Investment via Bank Transfer
For users who want to invest in a property in full by bank transfer (no wallet deduction).
Step 1 — Initialize
POST /wallet/invest/initialize
{
  "propertyId": "prop_abc123",
  "amount": 50000000,
  "quantity": 1,
  "paymentOption": "FULL_PAYMENT",
  "selectedReturnDays": 180,
  "referralCode": "REF-PARTNER-001"
}
Required fields: propertyId, amount, quantity
Response:
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "reference": "DINV_1716901200000_a1b2c3d4",
    "amount": 50000000,
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "psk_live_xxxxxxxx"
  }
}
Store reference in local state — you will need it to poll for completion.
Step 2 — Show Virtual Account
Use Paystack's SDK to display the bank transfer details. The access_code or authorization_url opens a Paystack modal/page that shows the one-time virtual account number and bank name the user should transfer to.
Web (Paystack Inline JS):
const handler = PaystackPop.setup({
  key: 'pk_live_xxxxxx',
  email: user.email,
  amount: data.amount,
  ref: data.reference,
  channels: ['bank_transfer'],
  onSuccess: (transaction) => {
    // Payment confirmed — poll for investment status
    pollInvestmentStatus(transaction.reference);
  },
  onCancel: () => {
    // User closed modal — reference is still valid for ~30 mins
    // Allow user to reopen payment modal
  }
});
handler.openIframe();
React Native (Paystack React Native SDK):
import { Paystack } from 'react-native-paystack-webview';
<Paystack
  paystackKey="pk_live_xxxxxx"
  billingEmail={user.email}
  amount={data.amount / 100} // SDK expects naira
  refNumber={data.reference}
  channels={['bank_transfer']}
  onSuccess={(res) => pollInvestmentStatus(res.transactionRef.reference)}
  onCancel={() => { /* reference still valid */ }}
  activityIndicatorColor="green"
/>
Step 3 — Poll for Completion
After the user transfers funds, poll to confirm the investment was created.
GET /investments/my-investments
Filter for the property and check if an investment with status: "COMPLETED" and paymentOption: "FULL_PAYMENT" now exists. Alternatively, use the wallet transaction endpoint:
GET /wallet-trx/transactions — look for a DIRECT_INVESTMENT type transaction with status: "SUCCESS" matching your reference.
Recommended polling approach:
async function pollInvestmentStatus(reference, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(3000); // wait 3 seconds between polls

    const { data } = await api.get('/wallet-trx/transactions', {
      params: { search: reference }
    });

    const tx = data?.data?.find(t => t.reference === reference);

    if (tx?.status === 'SUCCESS') {
      showSuccessScreen();
      return;
    }
    if (tx?.status === 'FAILED') {
      showFailureScreen();
      return;
    }
  }
  // After max polls: show "payment pending" state — webhook may still arrive
  showPendingScreen();
}
Important: Bank transfers in Nigeria can take up to 5 minutes to confirm. Do not show a failure state after the first poll. Show "Awaiting confirmation" and let the user know they'll get a push notification.
Scenario 2: Installment Investment via Bank Transfer
For users who want to start an installment plan by paying the first installment via bank transfer.
Step 1 — Initialize
POST /wallet/invest/initialize
{
  "propertyId": "prop_abc123",
  "amount": 5000000,
  "quantity": 2,
  "paymentOption": "INSTALLMENT",
  "installmentFrequency": "MONTHLY",
  "installmentDuration": 6
}
Additional fields for installment:
Field
Type
Required
Description
paymentOption
string
Yes
Must be "INSTALLMENT"
installmentFrequency
string
Yes
"WEEKLY", "MONTHLY", or "YEARLY"
installmentDuration
number
Yes
Number of payment periods (e.g. 6 for 6 months)

Note: amount here is the first installment amount only — not the full investment amount. The backend validates it against the property's minimum installment amount.
Response:
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "reference": "DINV_1716901200000_a1b2c3d4",
    "amount": 5000000,
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "psk_live_xxxxxxxx"
  }
}
Step 2 — Show Virtual Account
Same as Scenario 1. Use the access_code or authorization_url with Paystack SDK.
Step 3 — Poll for Completion
After confirmation, check that a new investment with paymentOption: "INSTALLMENT" and status: "ACTIVE" exists for the property. The installment schedule will be available at:
GET /investments/:investmentId/installments
Scenario 3: Pay an Existing Installment via Bank Transfer
For users who have an active installment plan and want to pay one of their pending installments by bank transfer instead of wallet.
Step 1 — Get the Installment Schedule
GET /investments/:investmentId/installments
{
  "data": [
    {
      "id": "inst_abc123",
      "amount": 5000000,
      "dueDate": "2026-07-01T00:00:00.000Z",
      "status": "PENDING"
    },
    {
      "id": "inst_def456",
      "amount": 5000000,
      "dueDate": "2026-08-01T00:00:00.000Z",
      "status": "PENDING"
    }
  ]
}
Ordering rule: Installments must be paid in order. The user can only pay the earliest PENDING or OVERDUE installment first. The backend enforces this — attempting to pay a later installment out of order will return a 400 error.
Step 2 — Initialize Bank Transfer for that Installment
POST /investments/installments/:paymentId/pay/bank-transfer
No request body needed. The amount is determined server-side.
Using inst_abc123 from above:
POST /investments/installments/inst_abc123/pay/bank-transfer
Response:
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "reference": "DINST_1716901200000_inst_ab",
    "amount": 5000000,
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "psk_live_xxxxxxxx"
  }
}
Why no amount in request body?
The backend locks the amount to min(scheduled installment amount, remaining investment balance). This prevents overpayment and avoids situations where the user sends the wrong amount to the virtual account.
Step 3 — Show Virtual Account
Same Paystack SDK usage as Scenario 1.
Step 4 — Poll for Completion
Check the installment status using:
GET /investments/:investmentId/transactions
Or re-fetch the installment schedule and check if inst_abc123 now has status: "PAID".
Error Responses
HTTP Status
When it occurs
What to show
400
"This installment has already been paid"
Refresh the installment list — it was already paid (possibly by auto-collection)
400
"You have unpaid earlier installments"
Highlight the earliest PENDING/OVERDUE installment
400
"This investment is already fully paid"
Refresh investment status
400
"Insufficient wallet balance" (wallet-pay path)
Show wallet top-up option
404
Installment not found
Invalid ID or not owned by user
400
"Cannot pay an installment in status: ..."
Installment is in a non-payable state (e.g. already PAID or deleted)

Notification Events
The backend fires in-app notifications and push notifications for these events. No action needed from the frontend beyond displaying them.
Event
Title
When
Investment confirmed (full)
"Investment Confirmed"
Bank transfer settled for full payment
Investment confirmed (installment start)
"Investment Confirmed"
First installment via bank transfer settled
Installment paid
"Installment Payment Confirmed"
Bank transfer installment settled
Investment fully paid
"Installment Payment Confirmed"
Final installment settled via bank transfer
Duplicate payment refunded
"Payment Refunded to Wallet"
Bank transfer arrived after auto-collection already paid the installment — amount credited to wallet

Handling the "Duplicate Payment Refunded" Case
This is Nigeria-specific. It happens when:
Auto-collection deducts the installment from wallet at the due date
The user's bank transfer for that same installment also arrives (the user had set both up)
What happens: The bank transfer amount is credited to the user's wallet as a deposit. The user gets a notification: "Your bank transfer was received but your installment was already collected. ₦X has been credited to your wallet."
What to show: On your notification tap handler for "Payment Refunded to Wallet", navigate the user to their wallet balance screen.
Admin Retry Endpoints (for stuck payments)
These are for admin use only when a webhook was missed (server restart, network blip). They are idempotent — safe to call multiple times.
Retry stuck direct investment:
POST /wallet/invest/retry/:reference
Retry stuck direct installment payment:
POST /wallet/installment/retry/:reference
Both require INVESTMENT_UPDATE_ALL admin permission.
Summary Comparison: Wallet vs Bank Transfer
Feature
Wallet
Bank Transfer
Deducts from wallet
✅ Immediate
❌ No wallet touched
Requires wallet balance
✅ Yes
❌ No
Payment confirmation
Instant
Up to 5 minutes
Supported for full payment
✅
✅
Supported for installment start
✅
✅ (new)
Supported for manual installment pay
✅
✅ (new)
Auto installment collection
✅ Wallet only
N/A

Quick Reference — Endpoint Table
Method
Endpoint
Who
Description
POST
/wallet/invest/initialize
Investor
Initialize bank transfer (full or installment start)
POST
/investments
Investor
Invest from wallet (full or installment start)
POST
/investments/installments/:paymentId/pay
Investor
Pay installment from wallet
POST
/investments/installments/:paymentId/pay/bank-transfer
Investor
Pay installment via bank transfer
GET
/investments/:id/installments
Investor
Get installment schedule
GET
/investments/:id/transactions
Investor
Get payment history for an investment
POST
/wallet/invest/retry/:reference
Admin
Retry stuck direct investment
POST
/wallet/installment/retry/:reference
Admin
Retry stuck direct installment
