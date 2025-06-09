import React from 'react';
import * as Sentry from "@sentry/react";

export const SentryTest: React.FC = () => {
  const triggerError = () => {
    try {
      // Intentionally throw an error
      throw new Error('Test error for Sentry monitoring');
    } catch (error) {
      Sentry.captureException(error);
      alert('Error captured by Sentry! Check your Sentry dashboard.');
    }
  };

  return (
    <div className="p-4 bg-red-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Sentry Test Component</h2>
      <button
        onClick={triggerError}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Trigger Test Error
      </button>
    </div>
  );
}; 