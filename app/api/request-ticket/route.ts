import { NextRequest, NextResponse } from 'next/server';
import { createTicket, submitTicket } from '@/lib/db';
import { TicketTypeSchema } from '@/lib/validations';
import { z } from 'zod';

const RequestTicketSchema = z.object({
  type: TicketTypeSchema,
  dietary_needs: z.array(z.enum([
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'nut-allergies',
    'no-restrictions',
  ])).min(1, 'Please select at least one dietary preference'),
  meal_choice: z.enum(['chicken', 'beef', 'fish', 'vegetarian']),
});

/**
 * POST /api/request-ticket - Request a new ticket with dietary preferences
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RequestTicketSchema.parse(body);

    // Create the ticket
    const ticket = createTicket(validated.type);

    // Submit the dietary preferences immediately
    const success = submitTicket(
      ticket.code,
      validated.dietary_needs,
      validated.meal_choice
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to submit preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket: {
        code: ticket.code,
        type: ticket.type,
        price: ticket.price,
      },
      message: 'Ticket created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error requesting ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
