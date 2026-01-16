# Web App Unit Tests

This directory contains unit tests for the Meal Planner web application.

## Setup

Before running tests for the first time, install the testing dependencies:

```bash
cd apps/web
pnpm install  # or npm install
```

## Running Tests

Run all tests:
```bash
pnpm test  # or npm test
```

Run specific test file:
```bash
pnpm test -- tokens.test.ts
```

Run tests in watch mode:
```bash
pnpm test -- --watch
```

## Test Structure

- `__tests__/lib/styles/` - Tests for design tokens and style utilities
  - `tokens.test.ts` - Unit tests for design token exports

## Dependencies

The test suite uses:
- **Jest** (v29.5.0) - Test runner and assertion library
- **ts-jest** (v29.1.0) - TypeScript support for Jest
- **@types/jest** (v29.5.0) - TypeScript type definitions

## Configuration

Test configuration is defined in `jest.config.js` at the root of the web app.
