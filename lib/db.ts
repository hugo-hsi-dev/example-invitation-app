import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Ticket, TicketType, MealChoice, DietaryNeed } from './types';
import { generateTicketCode, getTicketPrice } from './utils';

const DB_PATH = process.env.DATABASE_PATH || './database/invitations.db';

let db: Database.Database | null = null;

/**
 * Get or create database connection (singleton pattern)
 */
export function getDatabase(): Database.Database {
  if (db) return db;

  // Ensure database directory exists
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(DB_PATH);

  // Enable foreign keys and WAL mode for better performance
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  // Initialize schema
  initializeSchema(db);

  return db;
}

/**
 * Initialize database schema
 */
function initializeSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('regular', 'vip')),
      price INTEGER NOT NULL,
      dietary_needs TEXT,
      meal_choice TEXT,
      submitted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(code);
    CREATE INDEX IF NOT EXISTS idx_tickets_submitted ON tickets(submitted_at);
  `);
}

/**
 * Create a new ticket with a unique code
 */
export function createTicket(type: TicketType): Ticket {
  const database = getDatabase();
  const price = getTicketPrice(type);

  // Generate unique code (retry if collision)
  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    code = generateTicketCode();

    try {
      const stmt = database.prepare(`
        INSERT INTO tickets (code, type, price)
        VALUES (?, ?, ?)
      `);

      const result = stmt.run(code, type, price);

      // Fetch and return the created ticket
      const ticket = database
        .prepare('SELECT * FROM tickets WHERE id = ?')
        .get(result.lastInsertRowid) as Ticket;

      return ticket;
    } catch (error: unknown) {
      const err = error as { code?: string };
      // SQLITE_CONSTRAINT error for unique violation
      if (err.code === 'SQLITE_CONSTRAINT') {
        attempts++;
        continue;
      }
      throw error;
    }
  }

  throw new Error('Failed to generate unique ticket code after maximum attempts');
}

/**
 * Get ticket by code
 */
export function getTicketByCode(code: string): Ticket | undefined {
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM tickets WHERE code = ?');
  return stmt.get(code) as Ticket | undefined;
}

/**
 * Submit dietary needs and meal choice for a ticket
 */
export function submitTicket(
  code: string,
  dietaryNeeds: DietaryNeed[],
  mealChoice: MealChoice
): boolean {
  const database = getDatabase();

  const stmt = database.prepare(`
    UPDATE tickets
    SET dietary_needs = ?,
        meal_choice = ?,
        submitted_at = CURRENT_TIMESTAMP
    WHERE code = ? AND submitted_at IS NULL
  `);

  const result = stmt.run(JSON.stringify(dietaryNeeds), mealChoice, code);

  return result.changes > 0;
}

/**
 * Update dietary preferences for a ticket (allows unlimited updates)
 */
export function updateTicketPreferences(
  code: string,
  dietaryNeeds: DietaryNeed[],
  mealChoice: MealChoice
): boolean {
  const database = getDatabase();

  const stmt = database.prepare(`
    UPDATE tickets
    SET dietary_needs = ?,
        meal_choice = ?,
        submitted_at = CURRENT_TIMESTAMP
    WHERE code = ?
  `);

  const result = stmt.run(JSON.stringify(dietaryNeeds), mealChoice, code);

  return result.changes > 0;
}

/**
 * Get all tickets
 */
export function getAllTickets(): Ticket[] {
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM tickets ORDER BY created_at DESC');
  return stmt.all() as Ticket[];
}

/**
 * Get all submitted tickets (attendees)
 */
export function getSubmittedTickets(): Ticket[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM tickets
    WHERE submitted_at IS NOT NULL
    ORDER BY submitted_at DESC
  `);
  return stmt.all() as Ticket[];
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
