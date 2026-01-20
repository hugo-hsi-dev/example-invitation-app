'use client';

import { useState } from 'react';
import TicketEntry from '@/components/TicketEntry';
import DietaryForm from '@/components/DietaryForm';
import { DietaryNeed, MealChoice } from '@/lib/types';

type FlowState = 'entry' | 'form' | 'success';

interface TicketData {
  code: string;
  type: string;
  price: number;
  dietary_needs?: DietaryNeed[] | null;
  meal_choice?: MealChoice | null;
  submitted_at?: string | null;
}

export default function PreferencesPage() {
  const [flowState, setFlowState] = useState<FlowState>('entry');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  const handleValidTicket = (
    code: string,
    data: {
      type: string;
      price: number;
      dietary_needs?: DietaryNeed[] | null;
      meal_choice?: MealChoice | null;
      submitted_at?: string | null;
    }
  ) => {
    setTicketData({
      code,
      ...data,
    });
    setFlowState('form');
  };

  const handleSuccess = () => {
    setFlowState('success');
  };

  const handleStartOver = () => {
    setTicketData(null);
    setFlowState('entry');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dietary Preferences
          </h1>
          <p className="text-gray-600">
            View and update your dietary preferences
          </p>
        </div>

        {flowState === 'entry' && (
          <TicketEntry onValidTicket={handleValidTicket} />
        )}

        {flowState === 'form' && ticketData && (
          <DietaryForm
            ticketCode={ticketData.code}
            ticketType={ticketData.type}
            initialDietaryNeeds={ticketData.dietary_needs || undefined}
            initialMealChoice={ticketData.meal_choice || undefined}
            isEditing={!!ticketData.submitted_at}
            onSuccess={handleSuccess}
          />
        )}

        {flowState === 'success' && (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Preferences Updated!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your dietary preferences have been updated successfully.
                </p>
                <button
                  onClick={handleStartOver}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Update Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
