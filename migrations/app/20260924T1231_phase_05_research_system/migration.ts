#!/usr/bin/env -S node

import type { Contract as End } from '../../snapshots/113be2ae5f20ddfdc88328419703cb8e77224895868ad85ee279b81bd6f28efd/contract';
import endContract from '../../snapshots/113be2ae5f20ddfdc88328419703cb8e77224895868ad85ee279b81bd6f28efd/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/81d5a0b38dca8726110003bdd50f6808533776f6f463e281a7462b0ac0d6c77f/contract';
import startContract from '../../snapshots/81d5a0b38dca8726110003bdd50f6808533776f6f463e281a7462b0ac0d6c77f/contract.json' with { type: 'json' };

import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  rawSql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'articleCitation',
        constraint: 'articleCitation_sourceId_fkey',
        kind: 'foreignKey',
      }),

      this.dropColumn({
        schema: 'public',
        table: 'researchProject',
        column: 'notes',
      }),

      this.dropConstraint({
        schema: 'public',
        table: 'researchProjectSource',
        constraint: 'researchProjectSource_sourceId_fkey',
        kind: 'foreignKey',
      }),

      /*
       * Preserve the existing source table and all existing source IDs.
       *
       * The old migration dropped "source" and recreated "researchSource",
       * which would destroy existing source data and break sourceId references.
       *
       * PostgreSQL supports table, sequence, constraint, and column renames
       * without changing the stored data.
       */
      rawSql({
        id: 'researchSource.preserve-existing-source-data',
        label: 'Preserve existing source data while migrating source to researchSource',
        operationClass: 'widening',
        target: { id: 'postgres' },
        precheck: [
          {
            description: 'old source table exists and researchSource does not exist',
            sql: `
              SELECT
                EXISTS (
                  SELECT 1
                  FROM information_schema.tables
                  WHERE table_schema = 'public'
                    AND table_name = 'source'
                )
                AND NOT EXISTS (
                  SELECT 1
                  FROM information_schema.tables
                  WHERE table_schema = 'public'
                    AND table_name = 'researchSource'
                )
            `,
          },
        ],
        execute: [
          {
            description: 'rename source table to researchSource',
            sql: `
              ALTER TABLE "public"."source"
              RENAME TO "researchSource"
            `,
          },
          {
            description: 'rename source sequence to researchSource sequence',
            sql: `
              ALTER SEQUENCE "public"."source_id_seq"
              RENAME TO "researchSource_id_seq"
            `,
          },
          {
            description: 'rename source primary key',
            sql: `
              ALTER TABLE "public"."researchSource"
              RENAME CONSTRAINT "source_pkey"
              TO "researchSource_pkey"
            `,
          },
          {
            description: 'rename source unique constraint',
            sql: `
              ALTER TABLE "public"."researchSource"
              RENAME CONSTRAINT "source_url_key"
              TO "researchSource_url_key"
            `,
          },
          {
            description: 'rename collectedAt to accessedAt',
            sql: `
              ALTER TABLE "public"."researchSource"
              RENAME COLUMN "collectedAt"
              TO "accessedAt"
            `,
          },
          {
            description: 'remove accessedAt not null constraint',
            sql: `
              ALTER TABLE "public"."researchSource"
              ALTER COLUMN "accessedAt"
              DROP NOT NULL
            `,
          },
          {
            description: 'remove accessedAt default',
            sql: `
              ALTER TABLE "public"."researchSource"
              ALTER COLUMN "accessedAt"
              DROP DEFAULT
            `,
          },
          {
            description: 'rename notes to summary',
            sql: `
              ALTER TABLE "public"."researchSource"
              RENAME COLUMN "notes"
              TO "summary"
            `,
          },
          {
            description: 'rename publicationDate to publishedAt',
            sql: `
              ALTER TABLE "public"."researchSource"
              RENAME COLUMN "publicationDate"
              TO "publishedAt"
            `,
          },
          {
            description: 'add canonicalUrl',
            sql: `
              ALTER TABLE "public"."researchSource"
              ADD COLUMN "canonicalUrl" text
            `,
          },
          {
            description: 'add createdAt',
            sql: `
              ALTER TABLE "public"."researchSource"
              ADD COLUMN "createdAt" timestamptz DEFAULT now() NOT NULL
            `,
          },
          {
            description: 'add language',
            sql: `
              ALTER TABLE "public"."researchSource"
              ADD COLUMN "language" text
            `,
          },
          {
            description: 'add updatedAt with a temporary default',
            sql: `
              ALTER TABLE "public"."researchSource"
              ADD COLUMN "updatedAt" timestamptz DEFAULT now() NOT NULL
            `,
          },
          {
            description: 'remove temporary updatedAt default',
            sql: `
              ALTER TABLE "public"."researchSource"
              ALTER COLUMN "updatedAt"
              DROP DEFAULT
            `,
          },
        ],
        postcheck: [
          {
            description: 'researchSource exists and source no longer exists',
            sql: `
              SELECT
                EXISTS (
                  SELECT 1
                  FROM information_schema.tables
                  WHERE table_schema = 'public'
                    AND table_name = 'researchSource'
                )
                AND NOT EXISTS (
                  SELECT 1
                  FROM information_schema.tables
                  WHERE table_schema = 'public'
                    AND table_name = 'source'
                )
            `,
          },
        ],
      }),

      this.createTable({
        schema: 'public',
        table: 'researchClaim',
        columns: [
          col('classification', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('importance', 'text', {
            notNull: true,
            default: lit('MEDIUM'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('researchProjectId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('statement', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('UNVERIFIED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),

      this.createTable({
        schema: 'public',
        table: 'researchConclusion',
        columns: [
          col('conclusionType', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('confidence', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('researchProjectId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('summary', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),

      this.createTable({
        schema: 'public',
        table: 'researchEvidence',
        columns: [
          col('claimId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('evidenceText', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('relationship', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('researchProjectId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('sourceId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('sourceLocator', 'text', {
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),

      /*
       * The old "source" table has already been transformed into
       * "researchSource" above, so there is intentionally NO createTable()
       * for researchSource here.
       *
       * Existing IDs and source rows are preserved.
       */

      this.addColumn({
        schema: 'public',
        table: 'articleCitation',
        column: col('evidenceId', 'int4', {
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchNote',
        column: col('claimId', 'int4', {
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchNote',
        column: col('sourceId', 'int4', {
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchProject',
        column: col('completedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchProject',
        column: col('objective', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchProject',
        column: col('startedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchProjectSource',
        column: col('createdAt', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchProjectSource',
        column: col('relevance', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchProjectSource',
        column: col('role', 'text', {
          notNull: true,
          default: lit('SECONDARY'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'researchProject',
        column: col('slug', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      /*
       * Backfill researchProject.slug without requiring a second contract
       * or a typed dataTransform.
       *
       * The ID suffix guarantees uniqueness even when two projects have
       * identical titles.
       */
      rawSql({
        id: 'researchProject.backfill-slug',
        label: 'Backfill researchProject slugs',
        operationClass: 'data',
        target: { id: 'postgres' },
        precheck: [
          {
            description: 'researchProject rows still have null slugs',
            sql: `
              SELECT EXISTS (
                SELECT 1
                FROM "public"."researchProject"
                WHERE "slug" IS NULL
                LIMIT 1
              )
            `,
          },
        ],
        execute: [
          {
            description: 'generate unique researchProject slugs',
            sql: `
              UPDATE "public"."researchProject"
              SET "slug" =
                COALESCE(
                  NULLIF(
                    trim(
                      both '-'
                      from regexp_replace(
                        lower(trim("title")),
                        '[^a-z0-9]+',
                        '-',
                        'g'
                      )
                    ),
                    ''
                  ),
                  'research-project'
                )
                || '-'
                || "id"
              WHERE "slug" IS NULL
            `,
          },
        ],
        postcheck: [
          {
            description: 'all researchProject rows have slugs',
            sql: `
              SELECT NOT EXISTS (
                SELECT 1
                FROM "public"."researchProject"
                WHERE "slug" IS NULL
                LIMIT 1
              )
            `,
          },
        ],
      }),

      this.setNotNull({
        schema: 'public',
        table: 'researchProject',
        column: 'slug',
      }),

      this.setDefault({
        schema: 'public',
        table: 'researchProject',
        column: 'status',
        defaultSql: "DEFAULT 'DRAFT'",
        operationClass: 'widening',
      }),

      this.addUnique({
        schema: 'public',
        table: 'researchProject',
        constraint: 'researchProject_slug_key',
        columns: ['slug'],
      }),

      /*
       * researchSource_url_key already exists because the original source
       * unique constraint was renamed to researchSource_url_key above.
       *
       * Therefore the original generated addUnique(researchSource_url_key)
       * operation has intentionally been removed.
       */

      this.createIndex({
        schema: 'public',
        table: 'articleCitation',
        index: 'articleCitation_evidenceId_idx_a3fff281',
        columns: ['evidenceId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchClaim',
        index: 'researchClaim_classification_idx_52f80099',
        columns: ['classification'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchClaim',
        index: 'researchClaim_importance_idx_d8c1c450',
        columns: ['importance'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchClaim',
        index: 'researchClaim_researchProjectId_idx_a0714495',
        columns: ['researchProjectId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchClaim',
        index: 'researchClaim_status_idx_e98638ab',
        columns: ['status'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchConclusion',
        index: 'researchConclusion_conclusionType_idx_233ac5f6',
        columns: ['conclusionType'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchConclusion',
        index: 'researchConclusion_confidence_idx_37921071',
        columns: ['confidence'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchConclusion',
        index: 'researchConclusion_researchProjectId_idx_a0714495',
        columns: ['researchProjectId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchEvidence',
        index: 'researchEvidence_claimId_idx_7fdfe387',
        columns: ['claimId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchEvidence',
        index: 'researchEvidence_relationship_idx_95478b08',
        columns: ['relationship'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchEvidence',
        index: 'researchEvidence_researchProjectId_idx_a0714495',
        columns: ['researchProjectId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchEvidence',
        index: 'researchEvidence_sourceId_idx_d92a2571',
        columns: ['sourceId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchNote',
        index: 'researchNote_claimId_idx_7fdfe387',
        columns: ['claimId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchNote',
        index: 'researchNote_noteType_idx_544bb06b',
        columns: ['noteType'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchNote',
        index: 'researchNote_sourceId_idx_d92a2571',
        columns: ['sourceId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchProject',
        index: 'researchProject_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchProjectSource',
        index: 'researchProjectSource_role_idx_2c1ddf83',
        columns: ['role'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchSource',
        index: 'researchSource_publishedAt_idx_36121b91',
        columns: ['publishedAt'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchSource',
        index: 'researchSource_publisher_idx_8592540b',
        columns: ['publisher'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'researchSource',
        index: 'researchSource_sourceType_idx_d8b2a801',
        columns: ['sourceType'],
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchClaim',
        foreignKey: {
          name: 'researchClaim_researchProjectId_fkey',
          columns: ['researchProjectId'],
          references: {
            schema: 'public',
            table: 'researchProject',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchConclusion',
        foreignKey: {
          name: 'researchConclusion_researchProjectId_fkey',
          columns: ['researchProjectId'],
          references: {
            schema: 'public',
            table: 'researchProject',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchEvidence',
        foreignKey: {
          name: 'researchEvidence_researchProjectId_fkey',
          columns: ['researchProjectId'],
          references: {
            schema: 'public',
            table: 'researchProject',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchEvidence',
        foreignKey: {
          name: 'researchEvidence_claimId_fkey',
          columns: ['claimId'],
          references: {
            schema: 'public',
            table: 'researchClaim',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchEvidence',
        foreignKey: {
          name: 'researchEvidence_sourceId_fkey',
          columns: ['sourceId'],
          references: {
            schema: 'public',
            table: 'researchSource',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'articleCitation',
        foreignKey: {
          name: 'articleCitation_evidenceId_fkey',
          columns: ['evidenceId'],
          references: {
            schema: 'public',
            table: 'researchEvidence',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchNote',
        foreignKey: {
          name: 'researchNote_claimId_fkey',
          columns: ['claimId'],
          references: {
            schema: 'public',
            table: 'researchClaim',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'articleCitation',
        foreignKey: {
          name: 'articleCitation_sourceId_fkey',
          columns: ['sourceId'],
          references: {
            schema: 'public',
            table: 'researchSource',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchNote',
        foreignKey: {
          name: 'researchNote_sourceId_fkey',
          columns: ['sourceId'],
          references: {
            schema: 'public',
            table: 'researchSource',
            columns: ['id'],
          },
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'researchProjectSource',
        foreignKey: {
          name: 'researchProjectSource_sourceId_fkey',
          columns: ['sourceId'],
          references: {
            schema: 'public',
            table: 'researchSource',
            columns: ['id'],
          },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);