'use client';

import { useState } from 'react';
import { DietaryNeed, MealChoice } from '@/lib/types';

interface DietaryFormProps {
  ticketCode: string;
  ticketType: string;
  onSuccess: () => void;
  initialDietaryNeeds?: DietaryNeed[];
  initialMealChoice?: MealChoice;
  isEditing?: boolean;
}

const DIETARY_OPTIONS: { value: DietaryNeed; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'nut-allergies', label: 'Nut Allergies' },
  { value: 'no-restrictions', label: 'No Restrictions' },
];

const MEAL_OPTIONS: { value: MealChoice; label: string }[] = [
  { value: 'chicken', label: 'Chicken' },
  { value: 'beef', label: 'Beef' },
  { value: 'fish', label: 'Fish' },
  { value: 'vegetarian', label: 'Vegetarian' },
];

export default function DietaryForm({
  ticketCode,
  ticketType,
  onSuccess,
  initialDietaryNeeds,
  initialMealChoice,
  isEditing = false
}: DietaryFormProps) {
  const [dietaryNeeds, setDietaryNeeds] = useState<DietaryNeed[]>(
    initialDietaryNeeds || []
  );
  const [mealChoice, setMealChoice] = useState<MealChoice | ''>(
    initialMealChoice || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDietaryToggle = (need: DietaryNeed) => {
    setDietaryNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (dietaryNeeds.length === 0) {
      setError('Please select at least one dietary preference');
      return;
    }

    if (!mealChoice) {
      setError('Please select a meal choice');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/tickets/${ticketCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dietary_needs: dietaryNeeds,
          meal_choice: mealChoice,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to submit preferences');
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error('Submission error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isEditing ? 'Update Your Preferences' : 'Dietary Preferences'}
          </h2>
          <p className="text-gray-600">
            Ticket: <span className="font-semibold">{ticketCode}</span>
            {' • '}
            <span className="capitalize">{ticketType}</span>
          </p>
          {isEditing && (
            <p className="text-sm text-blue-600 mt-2">
              You can update your preferences as many times as needed
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dietary Needs Section */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Dietary Needs <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Select all that apply
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DIETARY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    dietaryNeeds.includes(option.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dietaryNeeds.includes(option.value)}
                    onChange={() => handleDietaryToggle(option.value)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meal Choice Section */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Meal Choice <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Select one option
            </p>
            <div className="grid grid-cols-2 gap-3">
              {MEAL_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    mealChoice === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="mealChoice"
                    value={option.value}
                    checked={mealChoice === option.value}
                    onChange={(e) => setMealChoice(e.target.value as MealChoice)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading
              ? (isEditing ? 'Updating...' : 'Submitting...')
              : (isEditing ? 'Update Preferences' : 'Submit Preferences')
            }
          </button>
        </form>
      </div>
    </div>
  );
}
