# Investment Models

NeedHomes supports several investment models, each with its own UI flow and data requirements.

## Model Overview

| API Value | Display Name | Route Suffix | Description |
|---|---|---|---|
| `OUTRIGHT_PURCHASE` | Outright Purchase | `/outright` | Buying a property unit in full. |
| `LAND_BANKING` | Land Banking | `/land-banking` | Investing in land for appreciation over a set period. |
| `FRACTIONAL_OWNERSHIP` | Fractional Ownership | `/fractional` | Buying a share of a property. |
| `SAVE_TO_OWN` | Save to Own | `/save-to-own` | Installment-based model to eventually own the property. |
| `CO_DEVELOPMENT` | Co-Development | `/default` | Investing in property development projects. |

## Data Mapping

The availability field varies depending on the model:
- **Fractional Ownership:** Uses `availableShares`.
- **Land Banking:** Uses `availablePlots` (API returns a string; must be cast to a number for calculations).
- **All others:** Use `availableUnits`.

## Property Detail Routing

### Investor Portal
The investor portal uses specific detail pages for each model:
- `src/routes/investors/properties/$propertyId/outright`
- `src/routes/investors/properties/$propertyId/land-banking`
- `src/routes/investors/properties/$propertyId/fractional`
- `src/routes/investors/properties/$propertyId/save-to-own`
- `src/routes/investors/properties/$propertyId/default` (Fallback/Co-Development)

### Partner Portal
The partner portal simplifies this. All property detail views route to a single fallback:
- `src/routes/partners/properties/$propertyId/default`

## Payment Integration
Payments are handled via **Paystack**.
- For full payments or initial installments, the frontend initializes a transaction with the backend and then opens the Paystack Inline JS modal.
- Post-payment, the frontend polls the backend for transaction confirmation.
