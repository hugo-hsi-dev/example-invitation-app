# Event Invitation App

A Next.js application for tracking event attendees' dietary needs and meal preferences using ticket-based authentication.

## Features

- **Ticket System**: Regular ($120) and VIP ($200) tickets with auto-generated 8-character codes
- **Dietary Tracking**: Multi-select dietary needs (vegetarian, vegan, gluten-free, etc.)
- **Meal Preferences**: Single-choice meal selection (chicken, beef, fish, vegetarian)
- **Admin Dashboard**: Create tickets and view attendee statistics
- **Statistics**: Real-time tracking of submissions, dietary needs, and meal choices

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage

### For Attendees

1. Navigate to the home page ([http://localhost:3000](http://localhost:3000))
2. Select your ticket type (Regular $120 or VIP $200)
3. Select your dietary needs (multiple selection allowed)
4. Choose your meal preference (single selection)
5. Submit to receive your unique ticket code
6. Save your ticket code for future reference

### For Admins

1. Navigate to the admin dashboard ([http://localhost:3000/admin](http://localhost:3000/admin))
2. Create tickets:
   - Select ticket type (Regular or VIP)
   - Enter quantity (1-100)
   - Click "Create Ticket(s)"
   - Copy the generated ticket codes
3. View attendee list and statistics

## Database Schema

```sql
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,              -- e.g., "ABC12345"
  type TEXT NOT NULL,                     -- "regular" or "vip"
  price INTEGER NOT NULL,                 -- Cents: 12000 or 20000
  dietary_needs TEXT,                     -- JSON: ["vegetarian", "nut-allergies"]
  meal_choice TEXT,                       -- "chicken", "beef", "fish", "vegetarian"
  submitted_at DATETIME,                  -- NULL until completed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Ticket Requests

- `POST /api/request-ticket` - Request a new ticket (public)
  - Body: `{ type: "regular" | "vip", dietary_needs: string[], meal_choice: string }`
  - Creates a ticket and submits preferences in one operation
  - Returns the generated ticket code

### Tickets (Admin)

- `POST /api/tickets` - Create new tickets in bulk (admin)
  - Body: `{ type: "regular" | "vip", quantity: number }`

- `GET /api/tickets` - Get all tickets (admin)

- `GET /api/tickets/[code]` - Validate ticket code
  - Returns ticket info if valid and not submitted

- `PATCH /api/tickets/[code]` - Submit dietary preferences for existing ticket
  - Body: `{ dietary_needs: string[], meal_choice: string }`

### Attendees

- `GET /api/attendees` - Get all submitted tickets with statistics
  - Returns attendees list and aggregated statistics

## Project Structure

```
├── app/
│   ├── page.tsx                     # Attendee ticket request page
│   ├── admin/page.tsx               # Admin dashboard
│   ├── api/
│   │   ├── request-ticket/route.ts  # Public ticket request endpoint
│   │   ├── tickets/route.ts         # Admin ticket creation & listing
│   │   ├── tickets/[code]/route.ts  # Ticket validation & submission
│   │   └── attendees/route.ts       # Attendee list & statistics
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── TicketRequestForm.tsx        # Ticket request with preferences
│   ├── TicketEntry.tsx              # Ticket code input (legacy)
│   ├── DietaryForm.tsx              # Dietary & meal selection (legacy)
│   ├── AdminTicketCreator.tsx       # Create tickets (admin)
│   ├── AttendeeList.tsx             # Display attendees
│   └── SuccessMessage.tsx           # Confirmation with ticket code
├── lib/
│   ├── db.ts                        # Database layer
│   ├── types.ts                     # TypeScript interfaces
│   ├── validations.ts               # Zod schemas
│   └── utils.ts                     # Utility functions
└── database/
    └── invitations.db               # SQLite database
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_PATH=./database/invitations.db
```

## Testing

The application has been tested with the following scenarios:

1. ✅ Ticket request flow (regular and VIP)
2. ✅ Admin bulk ticket creation
3. ✅ Ticket code validation
4. ✅ Dietary preference submission
5. ✅ Duplicate submission prevention
6. ✅ Invalid ticket code handling
7. ✅ Empty dietary needs validation
8. ✅ Statistics calculation
9. ✅ Attendee list display

### Test Results

- Created 6 tickets via request endpoint (4 regular, 2 VIP)
- All tickets auto-submitted with dietary preferences
- Verified statistics calculation (6 attendees tracked)
- Confirmed validation rules (empty dietary needs rejected)
- Database persistence working with WAL mode

## Dietary Options

**Dietary Needs** (multi-select):
- Vegetarian
- Vegan
- Gluten-free
- Dairy-free
- Nut allergies
- No restrictions

**Meal Choices** (single-select):
- Chicken
- Beef
- Fish
- Vegetarian

## Security Considerations

- No admin authentication (basic protection via obscure route)
- Ticket codes provide security through randomness (2.8 trillion combinations)
- Input validation via Zod schemas
- SQL injection protection via prepared statements

## Scalability

- Suitable for events with <1,000 attendees
- SQLite single-write limitation
- Migration path to PostgreSQL available for larger events

## License

MIT
