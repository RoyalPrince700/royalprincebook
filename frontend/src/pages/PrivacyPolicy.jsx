import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Section */}
      <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-24 h-72 bg-linear-to-b from-blue-100/80 via-indigo-100/40 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              Legal Information
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              We keep things simple and transparent. Here's what we collect and how we protect it.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-8 shadow-sm lg:p-12">
            <div className="prose prose-slate max-w-none">
              <p className="text-sm text-slate-500 mb-8">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">What We Collect</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    We only collect the basic information you provide when creating an account:
                  </p>
                  <ul className="text-slate-600 mb-6 ml-6 list-disc leading-relaxed">
                    <li>Your gmail</li>
                  
                  </ul>
                  <p className="text-slate-600 leading-relaxed">
                    That's it. No tracking, no cookies, no personal data collection beyond what's needed for your account.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use It</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Your information is used only for:
                  </p>
                  <ul className="text-slate-600 mb-6 ml-6 list-disc leading-relaxed">
                    <li>Creating and managing your account</li>
                    <li>Delivering the books you purchase</li>
                    <li>Sending you important updates about your account</li>
                    <li>Answering your questions if you contact us</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">We Don't Share Your Data</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Your personal information stays with us. We don't sell, share, or give away your data to anyone else. Ever.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Account, Your Control</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    You can:
                  </p>
                  <ul className="text-slate-600 mb-6 ml-6 list-disc leading-relaxed">
                    <li>Update your information anytime in your account settings</li>
                    <li>Delete your account if you no longer want to use our service</li>
                    <li>Contact us to ask questions about your data</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Keeping Things Safe</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We use industry-standard security to protect your information. Your password is encrypted, and we follow best practices to keep your data secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Questions?</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Have a question about your privacy? We're here to help.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg mb-6">
                    <p className="text-slate-600">
                      <strong>Email:</strong> contact@royalprincehub.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200">
                <Link
                  to="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;