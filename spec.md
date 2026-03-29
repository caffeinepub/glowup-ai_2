# GlowUp AI

## Current State
App has Dashboard, Scan, Tips, Diet, Style, Progress, Chat pages. ScanPage allows unlimited scans. No subscription/pricing system exists.

## Requested Changes (Diff)

### Add
- SubscriptionPage: shows 3 plans (Basic free, Chad $20, True Adam Pack $50) with features listed
- Scan limit enforcement: Basic = 2 scans max, Chad = 20, True Adam = 40
- Scan counter stored in localStorage
- When scan limit reached, show upgrade prompt instead of scan
- Navigation link to Subscription page
- Current plan badge visible on subscription page
- "Payment coming soon" notice on paid plans (no actual Stripe yet)

### Modify
- App.tsx: add `subscription` page type, track scanCount in state/localStorage, pass to ScanPage
- Navigation.tsx: add subscription icon/link
- ScanPage.tsx: check scan count before allowing scan, show upgrade wall if limit reached

### Remove
- Nothing removed

## Implementation Plan
1. Create SubscriptionPage.tsx with 3 plan cards
2. Add subscription page to App.tsx routing
3. Add scan count tracking with localStorage
4. Gate ScanPage with limit check
5. Add nav item for subscription
