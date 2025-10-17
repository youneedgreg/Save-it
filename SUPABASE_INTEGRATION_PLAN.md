# Supabase Integration Plan for Auth and Storage

## Overview
This plan outlines the steps to integrate Supabase for authentication and cloud storage in the Money Mastery System app. The current implementation uses local storage for all data persistence. The goal is to maintain local storage functionality for offline use and anonymous sessions, while adding Supabase for user authentication and data synchronization when logged in.

## Current State Analysis
- **Storage**: All financial data (transactions, budgets, debts, etc.) is stored locally using `localStorage` via `src/lib/storage.ts`.
- **Auth**: No authentication system; data is stored per-device/browser.
- **Framework**: Next.js 15 with TypeScript.
- **Dependencies**: No Supabase or auth libraries currently installed.

## Objectives
- Implement Supabase authentication (login/logout/signup).
- Sync local data to Supabase upon user login.
- Use Supabase as primary storage when user is authenticated.
- Fall back to local storage when offline or not logged in.
- Ensure data consistency between local and cloud.

## Detailed Plan

### 1. Setup and Dependencies
- **Install Supabase Client**:
  - Add `@supabase/supabase-js` to `package.json`.
  - Run `npm install @supabase/supabase-js`.
- **Environment Variables**:
  - Create `.env.local` with Supabase URL and anon key.
  - Add to `.gitignore` if not already.
- **Supabase Project Setup**:
  - Create a new Supabase project.
  - Enable authentication.
  - Create database tables for each data entity (transactions, budgets, etc.).

### 2. Authentication Implementation
- **Create Auth Context**:
  - New file: `src/contexts/auth-context.tsx`.
  - Provide login, logout, signup functions.
  - Track authentication state (user session).
- **Auth UI Components**:
  - Login/Signup forms in a new page or modal.
  - Integrate with existing navigation.
- **Protect Routes** (Optional):
  - For now, allow anonymous use with local storage.
  - Sync only when logged in.

### 3. Database Schema
- **Tables in Supabase**:
  - `users`: Linked to Supabase auth.
  - `financial_data`: JSON column for all user data, or separate tables for each entity (transactions, budgets, etc.).
  - Recommended: Separate tables for better querying (e.g., `transactions`, `budgets`).
- **Row Level Security (RLS)**:
  - Enable RLS on all tables.
  - Policies to ensure users can only access their own data.

### 4. Storage Layer Modifications
- **Modify `src/lib/storage.ts`**:
  - Add Supabase client import.
  - Check auth state before operations.
  - If authenticated: Perform CRUD on Supabase, sync to local.
  - If not authenticated: Use local storage only.
- **Sync Logic**:
  - On login: Upload local data to Supabase (merge or overwrite?).
  - On data changes: If logged in, save to Supabase and local.
  - On logout: Keep local data, stop syncing.
- **Conflict Resolution**:
  - Simple approach: Cloud overwrites local on login, or vice versa based on timestamps.

### 5. Data Migration and Sync
- **Initial Sync**:
  - When user logs in, fetch data from Supabase and merge with local.
  - If no cloud data, upload local data.
- **Real-time Sync** (Optional):
  - Use Supabase real-time subscriptions for live updates across devices.

### 6. Error Handling and Offline Support
- **Offline Mode**:
  - Detect network status.
  - Queue changes for sync when online.
- **Error Handling**:
  - Handle auth failures, network errors.
  - Fallback to local storage on sync failures.

### 7. Testing and Deployment
- **Unit Tests**:
  - Test storage functions with and without auth.
- **Integration Tests**:
  - Test login flow and data sync.
- **Deployment**:
  - Update build scripts if needed.
  - Ensure environment variables are set in production.

## Dependent Files to Edit
- `package.json`: Add Supabase dependency.
- `src/lib/storage.ts`: Core modifications for sync logic.
- `src/contexts/auth-context.tsx`: New auth provider.
- `src/app/layout.tsx`: Wrap with auth provider.
- New files: Supabase client config (`src/lib/supabase.ts`), auth components.

## Followup Steps
- Set up Supabase project and obtain keys.
- Implement auth UI and test login/logout.
- Test data sync scenarios (login with/without local data).
- Handle edge cases like network failures.
- Update documentation (README.md) with setup instructions.

## Risks and Considerations
- **Data Privacy**: Ensure RLS is properly configured.
- **Performance**: Syncing large datasets; consider pagination.
- **Breaking Changes**: Local storage fallback should prevent data loss.
- **User Experience**: Seamless transition between local and cloud.

This plan maintains backward compatibility while adding cloud features. Proceed with implementation after review.
