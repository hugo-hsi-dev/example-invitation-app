'use client';

import { useState } from 'react';
import { DietaryNeed, MealChoice } from '@/lib/types';

interface TicketEntryProps {
  onValidTicket: (
    code: string,
    ticketData: {
      type: string;
      price: number;
      dietary_needs?: DietaryNeed[] | null;
      meal_choice?: MealChoice | null;
      submitted_at?: string | null;
    }
  ) => void;
}

export default function TicketEntry({ onValidTicket }: TicketEntryProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const upperCode = code.toUpperCase().trim();

      if (upperCode.length !== 8) {
        setError('Ticket code must be 8 characters');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/tickets/${upperCode}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Invalid ticket code');
        setLoading(false);
        return;
      }

      onValidTicket(upperCode, {
        type: data.ticket.type,
        price: data.ticket.price,
        dietary_needs: data.ticket.dietary_needs,
        meal_choice: data.ticket.meal_choice,
        submitted_at: data.ticket.submitted_at,
      });
    } catch (err) {
      setError('Failed to validate ticket. Please try again.');
      console.error('Ticket validation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Enter Your Ticket Code
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ticketCode" className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Code
            </label>
            <input
              id="ticketCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC12345"
              maxLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-center text-lg tracking-wider"
              disabled={loading}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Format: 3 letters + 5 numbers (e.g., ABC12345)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 8}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Validating...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
