export type TicketType = 'regular' | 'vip';

export type DietaryNeed =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-allergies'
  | 'no-restrictions';

export type MealChoice = 'chicken' | 'beef' | 'fish' | 'vegetarian';

export interface Ticket {
  id: number;
  code: string;
  type: TicketType;
  price: number;
  dietary_needs: string | null; // JSON array stored as string
  meal_choice: MealChoice | null;
  submitted_at: string | null;
  created_at: string;
}

export interface TicketSubmission {
  dietary_needs: DietaryNeed[];
  meal_choice: MealChoice;
}

export interface CreateTicketRequest {
  type: TicketType;
  quantity: number;
}

export interface AttendeeStats {
  total: number;
  submitted: number;
  regular: number;
  vip: number;
  dietaryCounts: Record<DietaryNeed, number>;
  mealCounts: Record<MealChoice, number>;
}
