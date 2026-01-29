import type { Metadata } from 'next';
import { generateAuthPageMetadata } from '@/lib/seo/metadata';

/**
 * Registration page metadata
 * Marked with noindex to prevent search engine indexing
 */
export const metadata: Metadata = generateAuthPageMetadata(
  'Create Account',
  'Create your Meal Planner account to start receiving AI-powered, personalized meal plans delivered to your inbox every week.'
);

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
