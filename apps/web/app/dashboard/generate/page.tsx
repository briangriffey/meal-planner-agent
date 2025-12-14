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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Generate Meal Plan
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a new AI-powered meal plan for the week
        </p>
      </div>

      {!loading && !jobStatus && (
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label htmlFor="weekStartDate" className="block text-sm font-medium text-gray-700">
                Week Start Date
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Select the Monday that starts the week you want to plan for
              </p>
              <input
                type="date"
                id="weekStartDate"
                className="mt-2 block w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                placeholder={getNextMonday()}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Generate Meal Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {(loading || jobStatus) && (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {jobStatus?.state === 'completed' ? 'Completed!' : 'Generating your meal plan...'}
                </h3>
                {jobStatus?.progress !== undefined && (
                  <span className="text-sm text-gray-500">{jobStatus.progress}%</span>
                )}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    jobStatus?.state === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${jobStatus?.progress || 0}%` }}
                ></div>
              </div>

              {jobStatus?.estimatedTimeRemaining && jobStatus.state === 'active' && (
                <p className="mt-2 text-sm text-gray-500">
                  Estimated time remaining: {formatTimeRemaining(jobStatus.estimatedTimeRemaining)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    jobStatus?.state !== 'waiting' ? 'bg-green-500' : 'bg-gray-300'
                  } flex items-center justify-center`}
                >
                  {jobStatus?.state !== 'waiting' && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-3 text-sm text-gray-700">Queuing job...</p>
              </div>

              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    jobStatus?.state === 'active' || jobStatus?.state === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  } flex items-center justify-center`}
                >
                  {(jobStatus?.state === 'active' || jobStatus?.state === 'completed') && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Analyzing meal history and preferences...
                </p>
              </div>

              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    jobStatus?.progress && jobStatus.progress > 50 ? 'bg-green-500' : 'bg-gray-300'
                  } flex items-center justify-center`}
                >
                  {jobStatus?.progress && jobStatus.progress > 50 && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-3 text-sm text-gray-700">Generating meals with Claude AI...</p>
              </div>

              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    jobStatus?.state === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  } flex items-center justify-center`}
                >
                  {jobStatus?.state === 'completed' && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="ml-3 text-sm text-gray-700">Sending email and saving to database...</p>
              </div>
            </div>

            {jobStatus?.state === 'completed' && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  Meal plan generated successfully! Redirecting to view...
                </p>
              </div>
            )}

            {jobStatus?.state === 'failed' && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{jobStatus.failedReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
