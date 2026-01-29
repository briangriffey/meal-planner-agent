import type { Metadata } from 'next';
import { generateAuthPageMetadata } from '@/lib/seo/metadata';

/**
 * Login page metadata
 * Marked with noindex to prevent search engine indexing
 */
export const metadata: Metadata = generateAuthPageMetadata(
  'Sign In',
  'Sign in to your Meal Planner account to access your personalized meal plans and preferences.'
);

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
