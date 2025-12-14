'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobStatus {
  jobId: string;
  state: 'waiting' | 'active' | 'completed' | 'failed';
  progress?: number;
  estimatedTimeRemaining?: number;
  mealPlanId?: string;
  failedReason?: string;
  returnvalue?: {
    success: boolean;
    mealPlanId: string;
  };
}

export default function GeneratePage() {
  const router = useRouter();
  const [weekStartDate, setWeekStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState('');

  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/meal-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekStartDate: weekStartDate || getNextMonday(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to start meal plan generation');
        setLoading(false);
        return;
      }

      setJobStatus({
        jobId: data.jobId,
        state: 'waiting',
        progress: 0,
      });

      pollJobStatus(data.jobId);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/meal-plans/status/${jobId}`);
        const data: JobStatus = await response.json();

        setJobStatus(data);

        if (data.state === 'completed') {
          clearInterval(interval);
          setLoading(false);
          if (data.returnvalue?.mealPlanId) {
            setTimeout(() => {
              router.push(`/dashboard/meal-plans/${data.returnvalue!.mealPlanId}`);
            }, 2000);
          }
        } else if (data.state === 'failed') {
          clearInterval(interval);
          setLoading(false);
          setError(data.failedReason || 'Meal plan generation failed');
        }
      } catch (err) {
        clearInterval(interval);
        setLoading(false);
        setError('Failed to check job status');
      }
    }, 2000);
  };

  const formatTimeRemaining = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-primary-dark">
          Generate Meal Plan
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create a new AI-powered meal plan for the week
        </p>
      </div>

      {!loading && !jobStatus && (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-primary-light/10 to-primary/5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-dark">New Meal Plan</h3>
                <p className="text-sm text-gray-600">Select your preferred week to begin</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-8 space-y-6">
            <div>
              <label htmlFor="weekStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                Week Start Date
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Select the Monday that starts the week you want to plan for
              </p>
              <input
                type="date"
                id="weekStartDate"
                className="block w-full sm:w-auto border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                placeholder={getNextMonday()}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-150"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Meal Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {(loading || jobStatus) && (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-primary-light/10 to-primary/5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mr-4">
                {jobStatus?.state === 'completed' ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-dark">
                  {jobStatus?.state === 'completed' ? 'Completed!' : 'Generating your meal plan...'}
                </h3>
                {jobStatus?.progress !== undefined && (
                  <p className="text-sm text-gray-600">{jobStatus.progress}% complete</p>
                )}
              </div>
            </div>
          </div>
          <div className="px-6 py-8 sm:p-8 space-y-6">
            <div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    jobStatus?.state === 'completed'
                      ? 'bg-gradient-to-r from-primary-light to-primary'
                      : 'bg-gradient-to-r from-accent to-accent/90'
                  }`}
                  style={{ width: `${jobStatus?.progress || 0}%` }}
                ></div>
              </div>

              {jobStatus?.estimatedTimeRemaining && jobStatus.state === 'active' && (
                <p className="mt-3 text-sm text-gray-600">
                  Estimated time remaining: {formatTimeRemaining(jobStatus.estimatedTimeRemaining)}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-6 w-6 rounded-full ${
                    jobStatus?.state !== 'waiting' ? 'bg-gradient-to-br from-primary-light to-primary' : 'bg-gray-300'
                  } flex items-center justify-center shadow-sm`}
                >
                  {jobStatus?.state !== 'waiting' && (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-4 text-sm font-medium text-gray-900">Queuing job...</p>
              </div>

              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-6 w-6 rounded-full ${
                    jobStatus?.state === 'active' || jobStatus?.state === 'completed'
                      ? 'bg-gradient-to-br from-primary-light to-primary'
                      : 'bg-gray-300'
                  } flex items-center justify-center shadow-sm`}
                >
                  {(jobStatus?.state === 'active' || jobStatus?.state === 'completed') && (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-4 text-sm font-medium text-gray-900">
                  Analyzing meal history and preferences...
                </p>
              </div>

              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-6 w-6 rounded-full ${
                    jobStatus?.progress && jobStatus.progress > 50
                      ? 'bg-gradient-to-br from-primary-light to-primary'
                      : 'bg-gray-300'
                  } flex items-center justify-center shadow-sm`}
                >
                  {jobStatus?.progress && jobStatus.progress > 50 && (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-4 text-sm font-medium text-gray-900">Generating meals with Claude AI...</p>
              </div>

              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-6 w-6 rounded-full ${
                    jobStatus?.state === 'completed'
                      ? 'bg-gradient-to-br from-primary-light to-primary'
                      : 'bg-gray-300'
                  } flex items-center justify-center shadow-sm`}
                >
                  {jobStatus?.state === 'completed' && (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-4 text-sm font-medium text-gray-900">Sending email and saving to database...</p>
              </div>
            </div>

            {jobStatus?.state === 'completed' && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-green-800">
                    Meal plan generated successfully! Redirecting to view...
                  </p>
                </div>
              </div>
            )}

            {jobStatus?.state === 'failed' && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-red-800">{jobStatus.failedReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
