import { NextRequest, NextResponse } from "next/server";
import { createTicket, getAllTickets } from "@/lib/db";
import { CreateTicketSchema } from "@/lib/validations";
import { z } from "zod";

/**
 * POST /api/tickets - Create new tickets
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateTicketSchema.parse(body);

    const tickets = [];
    for (let i = 0; i < validated.quantity; i++) {
      const ticket = createTicket(validated.type);
      tickets.push(ticket);
    }

    return NextResponse.json({
      success: true,
      tickets,
      message: `Created ${tickets.length} ${validated.type} ticket(s)`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error creating tickets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tickets" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/tickets - Get all tickets (admin)
 */
export async function GET() {
  try {
    const tickets = getAllTickets();

    return NextResponse.json({
      success: true,
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}
