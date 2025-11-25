# Repository Guidelines

This repository is an Expo React Native app with Supabase backend. Use these guidelines when editing any files in this repo.

## Project Structure & Module Organization
- App entry: `App.tsx`; Expo config: `app.json`.
- Source code: `src/` with `components/`, `screens/`, `navigation/`, `hooks/`, `services/` (Supabase), `store/` (Zustand), `utils/`, `types/`.
- Assets: `assets/`.
- Database SQL: `supabase-sql/` (numbered scripts run in order).
- TypeScript paths: alias `@/*` → `src/*` (see `tsconfig.json`).

## Build, Test, and Development Commands
- Install deps: `npm install`.
- Start (Expo Dev): `npm start`.
- Platform targets: `npm run android` | `npm run ios` | `npm run web`.
- Clear Expo cache (helpful): `npx expo start -c`.

## Coding Style & Naming Conventions
- Language: TypeScript with `strict` mode.
- Indentation: 2 spaces; include semicolons; single quotes.
- Components: React Function Components in `.tsx`; PascalCase filenames (e.g., `AccountCard.tsx`).
- Hooks: `useX` naming in `src/hooks/` (e.g., `useAuth.ts`).
- Stores: colocate in `src/store/`, suffix `.store.ts`.
- Services: API/Supabase logic in `src/services/`, no UI.
- Imports: prefer path alias `@/…` over relative chains.
- Exports: prefer named exports; default only for screen components.

## Testing Guidelines
- No test framework is configured yet. For additions, use Jest + React Native Testing Library.
- Place tests under `src/__tests__/`; name files `*.test.ts`/`*.test.tsx`.
- Minimum: cover core utilities and critical screens’ logic; aim for 70%+ on new code.

## Commit & Pull Request Guidelines
- Commits: use Conventional Commits (e.g., `feat(auth): add email sign-in`).
- Keep changes focused; include rationale in body if non-trivial.
- PRs: clear description, steps to test, screenshots/screen recordings (Android/iOS/Web), related issue links, and any env/DB impacts.

## Security & Configuration
- Copy `.env.example` to `.env`; never commit secrets.
- Required vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Run SQL in `supabase-sql/` in numeric order; RLS is enforced—avoid service role keys in client code.

## Agent-Specific Notes
- Follow this guide for all paths under the repo root.
- Keep changes minimal, align with existing folder layout and naming.
