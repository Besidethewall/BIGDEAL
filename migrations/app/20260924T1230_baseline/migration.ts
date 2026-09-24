#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/81d5a0b38dca8726110003bdd50f6808533776f6f463e281a7462b0ac0d6c77f/contract';
import endContract from '../../snapshots/81d5a0b38dca8726110003bdd50f6808533776f6f463e281a7462b0ac0d6c77f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'article',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('excerpt', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('featuredImage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('gameId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('patchId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('publishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'articleCategory',
        columns: [
          col('articleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('categoryId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['articleId', 'categoryId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'articleCitation',
        columns: [
          col('articleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('excerpt', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sourceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'articleTag',
        columns: [
          col('articleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tagId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['articleId', 'tagId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'category',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'game',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('logo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'patch',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('gameId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('releaseDate', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('version', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'researchNote',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('noteType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('researchProjectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'researchProject',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('gameId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('researchQuestion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('OPEN'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'researchProjectSource',
        columns: [
          col('researchProjectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sourceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['researchProjectId', 'sourceId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'source',
        columns: [
          col('author', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('collectedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('publicationDate', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('publisher', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('reliability', 'text', {
            notNull: true,
            default: lit('MEDIUM'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('sourceType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'tag',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'article',
        constraint: 'article_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'category',
        constraint: 'category_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'game',
        constraint: 'game_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'patch',
        constraint: 'patch_gameId_version_key',
        columns: ['gameId', 'version'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'source',
        constraint: 'source_url_key',
        columns: ['url'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tag',
        constraint: 'tag_slug_key',
        columns: ['slug'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'article',
        index: 'article_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'article',
        index: 'article_patchId_idx_e1f5c9f9',
        columns: ['patchId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'article',
        index: 'article_publishedAt_idx_36121b91',
        columns: ['publishedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'article',
        index: 'article_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleCategory',
        index: 'articleCategory_articleId_idx_3dd188a0',
        columns: ['articleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleCategory',
        index: 'articleCategory_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleCitation',
        index: 'articleCitation_articleId_idx_3dd188a0',
        columns: ['articleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleCitation',
        index: 'articleCitation_sourceId_idx_d92a2571',
        columns: ['sourceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleTag',
        index: 'articleTag_articleId_idx_3dd188a0',
        columns: ['articleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleTag',
        index: 'articleTag_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'patch',
        index: 'patch_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'researchNote',
        index: 'researchNote_researchProjectId_idx_a0714495',
        columns: ['researchProjectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'researchProject',
        index: 'researchProject_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'researchProject',
        index: 'researchProject_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'researchProjectSource',
        index: 'researchProjectSource_researchProjectId_idx_a0714495',
        columns: ['researchProjectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'researchProjectSource',
        index: 'researchProjectSource_sourceId_idx_d92a2571',
        columns: ['sourceId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'article',
        foreignKey: {
          name: 'article_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'game', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'article',
        foreignKey: {
          name: 'article_patchId_fkey',
          columns: ['patchId'],
          references: { schema: 'public', table: 'patch', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleCategory',
        foreignKey: {
          name: 'articleCategory_articleId_fkey',
          columns: ['articleId'],
          references: { schema: 'public', table: 'article', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleCategory',
        foreignKey: {
          name: 'articleCategory_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'category', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleCitation',
        foreignKey: {
          name: 'articleCitation_articleId_fkey',
          columns: ['articleId'],
          references: { schema: 'public', table: 'article', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleCitation',
        foreignKey: {
          name: 'articleCitation_sourceId_fkey',
          columns: ['sourceId'],
          references: { schema: 'public', table: 'source', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleTag',
        foreignKey: {
          name: 'articleTag_articleId_fkey',
          columns: ['articleId'],
          references: { schema: 'public', table: 'article', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleTag',
        foreignKey: {
          name: 'articleTag_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'tag', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'patch',
        foreignKey: {
          name: 'patch_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'game', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'researchNote',
        foreignKey: {
          name: 'researchNote_researchProjectId_fkey',
          columns: ['researchProjectId'],
          references: { schema: 'public', table: 'researchProject', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'researchProject',
        foreignKey: {
          name: 'researchProject_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'game', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'researchProjectSource',
        foreignKey: {
          name: 'researchProjectSource_researchProjectId_fkey',
          columns: ['researchProjectId'],
          references: { schema: 'public', table: 'researchProject', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'researchProjectSource',
        foreignKey: {
          name: 'researchProjectSource_sourceId_fkey',
          columns: ['sourceId'],
          references: { schema: 'public', table: 'source', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
