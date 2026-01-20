'use client';

import AdminTicketCreator from '@/components/AdminTicketCreator';
import AttendeeList from '@/components/AttendeeList';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage tickets and view attendees
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <AdminTicketCreator />
          </div>
          <div className="lg:col-span-2">
            <AttendeeList />
          </div>
        </div>
      </div>
    </main>
  );
}
