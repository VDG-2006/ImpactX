# Project Scripts

These scripts are manual maintenance and diagnostic utilities. Run them from the project root after installing dependencies and loading the required environment variables.

## Database

- `database/cleanup_learners.ts` removes database learners that no longer exist in Clerk.
- `database/cleanup_quiz.ts` removes invalid quiz items.
- `database/clear_quiz_items.ts` clears quiz items and resets learner quiz state.
- `database/test_db_error.ts` checks learner node state queries.
- `database/test_db_update.ts` tests updating learner node state.

## Integrations

- `integrations/test_clerk.ts` checks Clerk connectivity and user access.

## API

- `api/test_quiz.ts` calls the local quiz API endpoint.