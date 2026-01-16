'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface HouseholdInvitation {
  id: string;
  email: string;
  inviterUser: {
    name: string | null;
    email: string;
  };
  createdAt: string;
  expiresAt: string;
}

interface InviteMemberModalProps {
  householdId: string;
  pendingInvitations: HouseholdInvitation[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InviteMemberModal({
  householdId,
  pendingInvitations,
  isOpen,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/households/${householdId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invitation');
      }

      setMessage({
        type: 'success',
        text: 'Invitation sent successfully',
      });

      setInviteEmail('');

      // Refresh the page to update invitations list
      router.refresh();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsInviting(false);
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }

    setIsCanceling(invitationId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/households/${householdId}/invitations/${invitationId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel invitation');
      }

      setMessage({
        type: 'success',
        text: 'Invitation cancelled successfully',
      });

      router.refresh();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsCanceling(null);
    }
  };

  const handleClose = () => {
    setInviteEmail('');
    setMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Invite Household Member
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Enter the email address of the person you want to invite to your household.
          </p>

          {message && (
            <div
              className={`rounded-lg p-4 mb-6 border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={sendInvitation} className="space-y-4 mb-6">
            <div>
              <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isInviting}
                className="flex-1 bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>

          {/* Pending Invitations Section */}
          {pendingInvitations.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Pending Invitations
              </h4>

              <div className="space-y-3">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-4 border border-gray-200 rounded-lg flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Sent {new Date(invitation.createdAt).toLocaleDateString()} ·
                        Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => cancelInvitation(invitation.id)}
                      disabled={isCanceling === invitation.id}
                      className="ml-4 text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCanceling === invitation.id ? 'Canceling...' : 'Cancel'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
