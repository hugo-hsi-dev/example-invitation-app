'use client';

import { useState } from 'react';
import { TicketType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface CreatedTicket {
  code: string;
  type: string;
  price: number;
}

export default function AdminTicketCreator() {
  const [ticketType, setTicketType] = useState<TicketType>('regular');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdTickets, setCreatedTickets] = useState<CreatedTicket[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: ticketType,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to create tickets');
        setLoading(false);
        return;
      }

      setCreatedTickets(data.tickets);
      setQuantity(1);
    } catch (err) {
      setError('Failed to create tickets. Please try again.');
      console.error('Ticket creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    const codes = createdTickets.map((t) => t.code).join('\n');
    navigator.clipboard.writeText(codes);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create Tickets</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                ticketType === 'regular'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="ticketType"
                value="regular"
                checked={ticketType === 'regular'}
                onChange={(e) => setTicketType(e.target.value as TicketType)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-semibold">Regular</div>
                <div className="text-sm text-gray-600">$120</div>
              </div>
            </label>
            <label
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                ticketType === 'vip'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="ticketType"
                value="vip"
                checked={ticketType === 'vip'}
                onChange={(e) => setTicketType(e.target.value as TicketType)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-semibold">VIP</div>
                <div className="text-sm text-gray-600">$200</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Creating...' : `Create ${quantity} Ticket(s)`}
        </button>
      </form>

      {createdTickets.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">
              Created Tickets ({createdTickets.length})
            </h3>
            <button
              onClick={handleCopyAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Copy All Codes
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            {createdTickets.map((ticket) => (
              <div
                key={ticket.code}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
              >
                <span className="font-mono font-semibold text-gray-800">
                  {ticket.code}
                </span>
                <div className="text-sm text-gray-600">
                  <span className="capitalize">{ticket.type}</span>
                  {' • '}
                  {formatPrice(ticket.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
