# Fix Hydration Mismatch in Currency Formatting

## Information Gathered
- Hydration error occurs because server renders "Ksh 0.00" (KES locale) while client renders "0,00 €" (EUR locale).
- `formatCurrency` uses `Intl.NumberFormat` with locale based on currency type.
- Currency context loads asynchronously from localStorage, defaulting to "KES" on server.
- Issue affects all pages using `formatCurrency`, including debts, budgets, etc.

## Plan
- [x] Modify `CurrencyProvider` to accept `initialCurrency` prop from server.
- [x] Update `layout.tsx` to read currency from cookies and pass to `CurrencyProvider`.
- [x] Modify `setCurrency` to set both localStorage and cookie for persistence.
- [x] Ensure server and client use the same currency for initial render.

## Dependent Files to be Edited
- `src/contexts/currency-context.tsx`: Accept initialCurrency prop.
- `src/app/layout.tsx`: Read cookie and pass initial currency.
- `src/lib/storage.ts`: Set cookie when setting currency.

## Followup Steps
- [ ] Test the application to ensure hydration mismatch is resolved.
- [ ] Verify currency selection persists across sessions.
- [ ] Check other pages for similar issues if any.
