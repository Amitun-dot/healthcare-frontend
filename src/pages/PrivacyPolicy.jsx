import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-6">
      
      <div className="w-full max-w-3xl">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <ShieldCheck size={22} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Privacy Policy
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Your data security and privacy are our top priorities
          </p>
        </div>

        {/* Content Card */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Information We Collect
            </h2>
            <p className="text-gray-600 leading-6">
              We collect basic user information such as name, email, and
              appointment details to provide seamless healthcare services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              How We Use Your Data
            </h2>
            <p className="text-gray-600 leading-6">
              Your data is used for appointment scheduling, prescription
              management, and improving system functionality.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Data Security
            </h2>
            <p className="text-gray-600 leading-6">
              We implement strong security measures to protect your personal
              information and restrict access to authorized users.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Third-Party Sharing
            </h2>
            <p className="text-gray-600 leading-6">
              We do not share your personal data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Consent
            </h2>
            <p className="text-gray-600 leading-6">
              By using this system, you agree to our privacy practices.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}