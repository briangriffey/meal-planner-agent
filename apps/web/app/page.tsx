import { auth } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

/**
 * Landing page metadata with SEO optimization
 * Focuses on meal planning, AI-powered features, and key benefits
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'AI-Powered Meal Planner - Stop Thinking About What\'s for Dinner',
  description: 'Get personalized, healthy meal plans delivered to your inbox every week. AI-powered recipes that match your nutrition goals, with direct links to order ingredients from HEB. Save time, eat healthy, stay organized.',
  keywords: [
    'meal planner',
    'AI meal planning',
    'weekly meal plan',
    'healthy meal planner',
    'personalized meal plans',
    'automatic meal planning',
    'meal prep app',
    'nutrition planner',
    'grocery list generator',
    'HEB meal planning',
    'family meal planner',
    'diet meal planner',
  ],
});

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-white to-accent/10">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  src="/logo-themed.svg"
                  alt="Easy Meal Planner"
                  width={40}
                  height={40}
                />
              </div>
              <h1 className="text-2xl font-bold text-primary-dark">Meal Planner</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-medium hover:shadow-lg transition-all duration-150"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-primary-dark font-medium hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-medium hover:shadow-lg transition-all duration-150"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-primary-dark mb-6">
            Stop Thinking About
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2">
              What&apos;s for Dinner
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Get personalized, healthy meal plans delivered to your inbox every week.
            AI-powered recipes that match your nutrition goals, with direct links to order ingredients from HEB.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-150 transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/example-meal-plan.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-primary text-primary-dark rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-150"
            >
              View Example
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary-dark mb-4">
              Save Time. Eat Healthy. Stay Organized.
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for stress-free meal planning, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-gradient-to-br from-primary-light/10 to-primary/10 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-150">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-primary-dark mb-3">Save Hours Every Week</h4>
              <p className="text-gray-600 leading-relaxed">
                No more staring at your pantry wondering what to make. Get a complete week of meals planned in seconds,
                delivered straight to your email every Sunday.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-150">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-primary-dark mb-3">Healthy & Easy to Make</h4>
              <p className="text-gray-600 leading-relaxed">
                Every meal meets your nutrition goals with customizable protein, calorie, and dietary requirements.
                Simple recipes that anyone can follow.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-150">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-dark to-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-primary-dark mb-3">One-Click HEB Shopping</h4>
              <p className="text-gray-600 leading-relaxed">
                Direct links to every ingredient in the HEB app. No manual searching, no guessing quantities.
                Order your groceries in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-primary-light/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary-dark mb-4">
              How It Works
            </h3>
            <p className="text-xl text-gray-600">
              Set it once, enjoy forever
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-150">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="mt-4">
                  <h4 className="text-xl font-bold text-primary-dark mb-3">Set Your Preferences</h4>
                  <p className="text-gray-600">
                    Tell us your nutrition goals, dietary restrictions, and how many meals you need each week.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-150">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="mt-4">
                  <h4 className="text-xl font-bold text-primary-dark mb-3">AI Plans Your Week</h4>
                  <p className="text-gray-600">
                    Every Sunday, our AI generates personalized meals that avoid repetition and match your goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-150">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="mt-4">
                  <h4 className="text-xl font-bold text-primary-dark mb-3">Get Your Email</h4>
                  <p className="text-gray-600">
                    Receive a beautiful email with your full meal plan, recipes, nutrition info, and ingredient links.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-150">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="mt-4">
                  <h4 className="text-xl font-bold text-primary-dark mb-3">Order & Cook</h4>
                  <p className="text-gray-600">
                    Click the HEB links to add ingredients to your cart, then follow the simple recipes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary-dark mb-4">
              Your Complete AI Meal Planner
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Personalized meal plans, smart shopping lists, and a powerful dashboard -
              plus weekly email delivery to keep your whole family on track.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: AI-Powered Meal Plans */}
            <div className="bg-gradient-to-br from-primary-light/10 to-primary/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">AI-Powered Meal Plans</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Claude AI generates personalized weekly meal plans tailored to your nutrition goals and preferences.
              </p>
            </div>

            {/* Feature 2: Interactive Dashboard */}
            <div className="bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">Interactive Dashboard</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track your meal planning at a glance with stats, quick actions, and easy access to recent plans.
              </p>
            </div>

            {/* Feature 3: Favorite Recipes */}
            <div className="bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-dark to-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">Favorite Recipes</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Save your favorite meals and filter by calories, protein, and dietary preferences.
              </p>
            </div>

            {/* Feature 4: Smart Shopping Lists */}
            <div className="bg-gradient-to-br from-primary-light/10 to-primary/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">Smart Shopping Lists</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Auto-aggregated ingredients organized by category. Print them or shop online instantly.
              </p>
            </div>

            {/* Feature 5: Family Sharing */}
            <div className="bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">Family Sharing</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Share meal plans with your household so everyone stays in sync and on the same page.
              </p>
            </div>

            {/* Feature 6: Weekly Email Delivery */}
            <div className="bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-dark to-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">Weekly Email Delivery</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get your complete meal plan delivered to your inbox every week, automatically.
              </p>
            </div>

            {/* Feature 7: HEB Integration */}
            <div className="bg-gradient-to-br from-primary-light/10 to-primary/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">HEB Integration</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                One-click links to order all your ingredients directly from HEB. No manual searching.
              </p>
            </div>

            {/* Feature 8: Meal History */}
            <div className="bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-150">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary-dark mb-2">Meal History</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track what you&apos;ve eaten and avoid repetition with smart history tracking.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-150 transform hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Simplify Your Life?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of families who have reclaimed their time and improved their health with AI-powered meal planning.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-primary-dark rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-150 transform hover:scale-105"
          >
            Get Started Free
          </Link>
          <p className="text-white/80 mt-4 text-sm">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">Meal Planner</h4>
              <p className="text-sm">
                AI-powered meal planning that saves you time and keeps you healthy.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                {session && <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Meal Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
