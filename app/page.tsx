'use client';

import { useState } from 'react';
import TicketRequestForm from '@/components/TicketRequestForm';
import SuccessMessage from '@/components/SuccessMessage';

type FlowState = 'form' | 'success';

export default function Home() {
  const [flowState, setFlowState] = useState<FlowState>('form');
  const [ticketCode, setTicketCode] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [ticketPrice, setTicketPrice] = useState(0);

  const handleSuccess = (code: string, type: string, price: number) => {
    setTicketCode(code);
    setTicketType(type);
    setTicketPrice(price);
    setFlowState('success');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Event RSVP
          </h1>
          <p className="text-gray-600">
            Request your ticket and submit your preferences
          </p>
        </div>

        {flowState === 'form' && (
          <TicketRequestForm onSuccess={handleSuccess} />
        )}

        {flowState === 'success' && (
          <SuccessMessage
            ticketCode={ticketCode}
            ticketType={ticketType}
            ticketPrice={ticketPrice}
          />
        )}
      </div>
    </main>
  );
}
