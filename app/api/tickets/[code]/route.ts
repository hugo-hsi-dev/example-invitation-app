import { NextRequest, NextResponse } from 'next/server';
import { getTicketByCode, updateTicketPreferences } from '@/lib/db';
import { TicketCodeSchema, TicketSubmissionSchema } from '@/lib/validations';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ code: string }>;
}

/**
 * GET /api/tickets/[code] - Validate ticket and check if not yet submitted
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { code } = await params;
    const upperCode = code.toUpperCase();

    // Validate code format
    const validated = TicketCodeSchema.parse(upperCode);

    const ticket = getTicketByCode(validated);

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket: {
        code: ticket.code,
        type: ticket.type,
        price: ticket.price,
        dietary_needs: ticket.dietary_needs ? JSON.parse(ticket.dietary_needs) : null,
        meal_choice: ticket.meal_choice,
        submitted_at: ticket.submitted_at,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid ticket code format' },
        { status: 400 }
      );
    }

    console.error('Error validating ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate ticket' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tickets/[code] - Submit dietary needs and meal choice
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { code } = await params;
    const upperCode = code.toUpperCase();

    // Validate code format
    TicketCodeSchema.parse(upperCode);

    const body = await request.json();
    const validated = TicketSubmissionSchema.parse(body);

    const success = updateTicketPreferences(
      upperCode,
      validated.dietary_needs,
      validated.meal_choice
    );

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error submitting ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit ticket' },
      { status: 500 }
    );
  }
}
