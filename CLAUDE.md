# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Agent First's **whitelabel documentation system** -- a Node.js utility that templates and
brands API documentation for integration into **Mintlify**-based documentation sites. Companies use
it to rebrand Agent First's Search, Browser, and Reporting API docs under their own name and domain.

## Commands

- **Whitelabel**: `npm run whitelabel -- --path=endpoints --company='Company Name' --endpoint=api.example.com`
- **Lint JS/JSON**: `npx eslint -c linter/eslint.config.js [files]`
- **Lint SQL**: `npm run lint-sql -- [file]`

There are no tests.

## Architecture

### Template System

The core mechanism is placeholder replacement. Template files in `templates/` contain variables like
`{{COMPANY_NAME}}`, `{{COMPANY_SLUG}}`, and `{{API_ENDPOINT}}`. The whitelabel script
(`scripts/whitelabel.js`) replaces these with company-specific values and writes output to the parent
Mintlify project. The required `--path` parameter controls the output path (e.g., `endpoints`):

- `*.mdx` (whitelabel root) -> `{mintlify-root}/{path}/` (copied as-is)
- `reference/` -> `{mintlify-root}/{path}/reference/` (copied as-is)
- `templates/snippets/` -> `{mintlify-root}/snippets/whitelabel/` (rendered MDX snippet components)
- `templates/openapi.json` -> `{mintlify-root}/{path}/openapi.json` (rendered OpenAPI 3.1.0 spec)

The script cleans `{mintlify-root}/{path}/` and `{mintlify-root}/snippets/whitelabel/` before each
run so stale files from a previous run don't linger.

`COMPANY_SLUG` is derived as `COMPANY_NAME.toUpperCase().replaceAll(' ', '_')`.

### Content Structure

- Root `.mdx` files: tutorial/overview pages for each API feature (Search, Browser, Geotargeting,
  Scheduling, Pricing, Usage)
- `reference/`: API reference pages that render the OpenAPI spec
- `templates/snippets/`: reusable MDX components imported by the documentation pages
- `assets/`: brand logos and social images

### Integration Model

This repo is consumed as a **git submodule** within a parent Mintlify documentation project (e.g.,
at `whitelabel/` rather than inside the content path). The whitelabel script generates all content
files into the consumer's Mintlify tree under the `--path` path, so the submodule is purely a
source/tool. The script detects the Mintlify root by running `git rev-parse --show-toplevel` from the
parent directory.

## Code Style

- Node.js ES modules (`"type": "module"` in package.json)
- Prettier: 100 char width, single quotes, no trailing commas, collapsed object wrapping, always
  wrap prose
- ESLint: extends recommended; `no-undef`, `no-use-before-define` as errors; unused vars prefixed
  with `_` are allowed
- Linter config lives in the `linter/` git submodule
