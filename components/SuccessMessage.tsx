'use client';

import { formatPrice } from '@/lib/utils';

interface SuccessMessageProps {
  ticketCode: string;
  ticketType: string;
  ticketPrice: number;
}

export default function SuccessMessage({ ticketCode, ticketType, ticketPrice }: SuccessMessageProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Ticket Confirmed!
        </h2>

        <p className="text-gray-600 mb-6">
          Your ticket has been created and your preferences have been saved.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-2">Your Ticket Code</p>
          <p className="text-3xl font-bold text-gray-800 tracking-wider mb-4">
            {ticketCode}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded-full font-semibold ${
              ticketType === 'vip'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {ticketType === 'vip' ? 'VIP Ticket' : 'Regular Ticket'}
            </span>
            <span className="text-gray-700 font-semibold">
              {formatPrice(ticketPrice)}
            </span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium">
            📧 Please save this ticket code
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            You may need it for future reference
          </p>
        </div>

        <p className="text-sm text-gray-500">
          We look forward to seeing you at the event!
        </p>
      </div>
    </div>
  );
}
