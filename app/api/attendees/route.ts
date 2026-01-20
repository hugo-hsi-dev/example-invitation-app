import { NextResponse } from 'next/server';
import { getSubmittedTickets } from '@/lib/db';
import { DietaryNeed, MealChoice, AttendeeStats } from '@/lib/types';

/**
 * GET /api/attendees - Get all submitted tickets with statistics
 */
export async function GET() {
  try {
    const tickets = getSubmittedTickets();

    // Calculate statistics
    const stats: AttendeeStats = {
      total: tickets.length,
      submitted: tickets.length,
      regular: 0,
      vip: 0,
      dietaryCounts: {
        'vegetarian': 0,
        'vegan': 0,
        'gluten-free': 0,
        'dairy-free': 0,
        'nut-allergies': 0,
        'no-restrictions': 0,
      },
      mealCounts: {
        'chicken': 0,
        'beef': 0,
        'fish': 0,
        'vegetarian': 0,
      },
    };

    tickets.forEach((ticket) => {
      // Count ticket types
      if (ticket.type === 'regular') stats.regular++;
      if (ticket.type === 'vip') stats.vip++;

      // Count dietary needs
      if (ticket.dietary_needs) {
        try {
          const needs = JSON.parse(ticket.dietary_needs) as DietaryNeed[];
          needs.forEach((need) => {
            if (need in stats.dietaryCounts) {
              stats.dietaryCounts[need]++;
            }
          });
        } catch (e) {
          console.error('Error parsing dietary needs:', e);
        }
      }

      // Count meal choices
      if (ticket.meal_choice && ticket.meal_choice in stats.mealCounts) {
        stats.mealCounts[ticket.meal_choice as MealChoice]++;
      }
    });

    return NextResponse.json({
      success: true,
      attendees: tickets,
      stats,
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
}
