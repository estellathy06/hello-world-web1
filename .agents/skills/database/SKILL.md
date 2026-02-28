---
name: Database Management
description: Guidelines and instructions for working with the Supabase database, including schema design, migrations, and Edge Functions.
---

# Database (Supabase) Skills Document

## Overview
This document outlines the principles, conventions, and procedures for interacting with the Supabase backend in the Estella Tang Portfolio project or any associated applications. It covers database schema design, migrations, Row Level Security (RLS), and Edge Functions.

## Core Database Principles
1. **Migrations-First**: All schema changes MUST be made using Supabase migrations (`apply_migration` tool). Do not make manual changes via raw SQL execution or the user interface.
2. **Security by Default**: All tables must have Row Level Security (RLS) enabled.
3. **Branching**: Use development branches (`create_branch`) for testing schema changes before merging them to production (`merge_branch`).

## Tools & Integrations
- **MCP Server**: Use the `supabase-mcp-server` tools to manage the project.
- **Raw SQL**: Execute raw SQL queries (`execute_sql`) only for reading data or testing queries. Use migrations for all DDL operations.
- **Advisors**: Run the `get_advisors` tool regularly to catch missing RLS policies, performance vulnerabilities, and security issues.

## Schema Design & Migrations
- **Naming Conventions**: Use `snake_case` for tables, columns, and migration names.
- **Migration Format**: Migrations should be self-contained SQL scripts. Do not hardcode references to generated IDs in data migrations.
- **Applying Migrations**: Use `apply_migration(project_id, name, query)` to execute DDL operations. The `name` should describe the change (e.g., `create_users_table`).

## Row Level Security (RLS)
- Every table MUST have `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`.
- Define explicit policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Example policy:
  ```sql
  CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );
  ```

## Edge Functions
- **Runtime**: Supabase Edge Functions use Deno.
- **Deployment**: Use `deploy_edge_function` to push new versions. Provide the `entrypoint_path` and all related files including `deno.json`.
- **Security**: ALWAYS require a valid JWT (`verify_jwt: true`) unless the function explicitly implements custom authentication (like webhooks) or the user strictly requests otherwise.

## Common Operations
- **Getting Project Details**: Use `list_projects` to find the project ID, then `get_project` to view details.
- **Checking Costs**: Always run `get_cost` and `confirm_cost` before creating a new project or branch.
- **Generating Types**: After schema changes, generate TypeScript types using `generate_typescript_types` to keep the frontend synchronized.
- **Searching Docs**: If unsure about any Supabase feature, use `search_docs` with a GraphQL query to access the latest documentation.

## Types & Frontend Integration
- Use the generated TypeScript types in the frontend application to ensure type safety when fetching or mutating data using the `@supabase/supabase-js` client.
