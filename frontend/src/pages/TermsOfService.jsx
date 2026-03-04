import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Simple terms for using our book platform. We want you to feel comfortable and confident.
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
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Welcome to Royal Prince Book</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We're excited to share "Leading From Within" and other leadership content with you. These simple terms help keep things fair and clear for everyone.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Creating an Account</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    To read our books, you'll need to create a free account with:
                  </p>
                  <ul className="text-slate-600 mb-6 ml-6 list-disc leading-relaxed">
                    <li>Your name</li>
                    <li>A valid email address</li>
                    <li>A secure password</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed">
                    Keep your password safe and let us know if you think someone else is using your account.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Purchasing Books</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    When you buy a book:
                  </p>
                  <ul className="text-slate-600 mb-6 ml-6 list-disc leading-relaxed">
                    <li>You get permanent access to read it online</li>
                    <li>Payments are processed securely through trusted partners</li>
                    <li>You can read on any device with your account</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Refund Promise</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Not happy with your purchase? Contact us within 7 days and we'll give you a full refund. We want you to love what you read.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Using Our Service</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Please use our platform responsibly:
                  </p>
                  <ul className="text-slate-600 mb-6 ml-6 list-disc leading-relaxed">
                    <li>Don't share your account with others</li>
                    <li>Don't copy or distribute our books</li>
                    <li>Be respectful in any communications</li>
                    <li>Follow the law</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Content, Our Rights</h2>
                  <p className="text-slate-600 leading-relaxed">
                    The books and content on our platform belong to us. When you purchase, you get the right to read them personally. Our content helps people grow and lead better.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">We Do Our Best</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We strive to provide a great experience, but things aren't always perfect. We're not responsible for issues beyond our control, and our liability is limited to what you've paid us.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to These Terms</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We might update these terms occasionally. If we do, we'll let you know through the website. Continuing to use our service means you agree to the changes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Need Help?</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Questions about these terms or our service? We're here to help.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg mb-6">
                    <p className="text-slate-600">
                      <strong>Email:</strong> contact@royalprincebook.com
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

export default TermsOfService;