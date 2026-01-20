'use client';

import { useEffect, useState } from 'react';
import { Ticket, AttendeeStats, DietaryNeed } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function AttendeeList() {
  const [attendees, setAttendees] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<AttendeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const response = await fetch('/api/attendees');
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to fetch attendees');
        setLoading(false);
        return;
      }

      setAttendees(data.attendees);
      setStats(data.stats);
    } catch (err) {
      setError('Failed to load attendees');
      console.error('Attendee fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Loading attendees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Attendees ({attendees.length})
        </h2>
        <button
          onClick={fetchAttendees}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Refresh
        </button>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Total Submitted</div>
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Regular</div>
            <div className="text-2xl font-bold text-green-600">{stats.regular}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">VIP</div>
            <div className="text-2xl font-bold text-purple-600">{stats.vip}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-orange-600">
              {formatPrice(
                stats.regular * 12000 + stats.vip * 20000
              )}
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Meal Choices</h3>
            <div className="space-y-2">
              {Object.entries(stats.mealCounts).map(([meal, count]) => (
                <div key={meal} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{meal}</span>
                  <span className="font-semibold text-gray-800">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Dietary Needs</h3>
            <div className="space-y-2">
              {Object.entries(stats.dietaryCounts)
                .filter(([, count]) => count > 0)
                .map(([need, count]) => (
                  <div key={need} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">
                      {need.replace('-', ' ')}
                    </span>
                    <span className="font-semibold text-gray-800">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {attendees.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No attendees have submitted their preferences yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Ticket Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Meal Choice
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dietary Needs
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-gray-800">
                    {attendee.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="capitalize">{attendee.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="capitalize">{attendee.meal_choice}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {attendee.dietary_needs ? (
                      <div className="flex flex-wrap gap-1">
                        {(JSON.parse(attendee.dietary_needs) as DietaryNeed[]).map((need) => (
                          <span
                            key={need}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {need.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {attendee.submitted_at
                      ? new Date(attendee.submitted_at).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
