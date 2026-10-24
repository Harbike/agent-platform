import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
// import { AxiosError } from "axios";
import { api } from "../api/client";
import type { User, AuthResponse } from "../types/auth";
import Logo from "../assets/logo.png";

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
const [isSupportOpen, setIsSupportOpen] = useState(false);
const [resetEmailSent, setResetEmailSent] = useState(false);

//   to allow sign in where server-side is done
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     const sanitizedEmail = email.trim().toLowerCase();

//     try {
//       const response = await api.post<AuthResponse>("/auth/login", {
//         email: sanitizedEmail,
//         password,
//         remember_me: rememberMe,
//       });

//       const { accessToken, user } = response.data;

//       if (accessToken) {
//         localStorage.setItem("amp_access_token", accessToken);
//       }

//       onLoginSuccess(user);
//     } catch (err) {
//       const axiosError = err as AxiosError<{ message?: string }>;
//       setError(
//         axiosError.response?.data?.message ||
//           "Invalid email or password. Please try again.",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

// sign in using mock data
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const sanitizedEmail = email.trim().toLowerCase();

    try {
  const response = await api.post<AuthResponse>("/auth/login", {
    email: sanitizedEmail,
    password,
    remember_me: rememberMe,
  });

  const { accessToken, user } = response.data;
  if (accessToken) localStorage.setItem("amp_access_token", accessToken);
  onLoginSuccess(user);
} catch {
  // MOCK FALLBACK: Allows login during frontend UI development
  console.warn("Backend unavailable, logging in with mock user...");
  onLoginSuccess({
    id: "usr_01",
    first_name: "Abike",
    last_name: "Yinusa",
    email: sanitizedEmail || "abike.yinusa@amp.org",
    role: "Superadmin",
    scope: {
        scope_type: "global",
  scope_area_id: "Lagos",
  scope_position_id: "SA"
    },
    is_active: true,
  });
}
  };

  return (
    <div className="w-full bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-160">
      {/* Left Brand Panel */}
      <div className="lg:w-3/4 bg-[#660022] text-white p-8 lg:p-12 flex flex-col justify-between text-center relative overflow-hidden">
        <div />
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            Agent Management Platform
          </h1>
          <p className="text-slate-400 text-sm">
            Secure access to your organisation directory
          </p>
        </div>
        {/* Network Hierarchy Illustration */}
        <div className="my-auto py-8 flex flex-col items-center justify-center relative">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-6">
              <img
                src={Logo}
                alt="AMP LOGO"
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-500 pt-4 border-t border-slate-800/60 flex items-center justify-center">
          <span className="text-[10px] text-slate-600 font-mono">
            © {new Date().getFullYear()} Harbike | All rights reserved.
          </span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:w-full p-8 lg:p-12 flex flex-col justify-between bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-6">
            <img
              src={Logo}
              alt="AMP LOGO"
              className="w-3.5 h-3.5 object-contain"
            />
            <span>AMP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome
            </h2>
            <p className="text-sm text-slate-600">
              Sign in to continue to the organisation directory
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start space-x-2.5 p-3.5 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#660022] focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#660022] focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d002f] hover:text-[#660022] focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border border-[#8d002f] appearance-none bg-white checked:bg-[#8d002f] checked:border-[#8d002f] focus:ring-offset-2 relative checked:after:content-[''] checked:after:absolute checked:after:left-1.25 checked:after:top-0.5 checked:after:w-1 checked:after:h-2 checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45"
                />
                <span className="text-slate-600 text-xs font-medium">
                  Remember me
                </span>
              </label>

              <button
  type="button"
  onClick={() => {
    setResetEmailSent(false);
    setIsForgotPasswordOpen(true);
  }}
  className="text-xs text-[#8d002f] hover:underline font-medium focus:outline-none"
>
  Forgot password?
</button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#8d002f] hover:bg-[#660022] active:bg-[#52001b] text-white font-medium rounded-lg text-sm transition-colors shadow-sm shadow-blue-600/30 flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need help signing in?{" "}
            <div className="mt-6 text-center text-xs text-slate-500">
  Need help signing in?{" "}
  <button
    type="button"
    onClick={() => setIsSupportOpen(true)}
    className="text-[#8d002f] hover:underline font-medium focus:outline-none"
  >
    Contact your administrator.
  </button>
</div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
{isForgotPasswordOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h3>

      {resetEmailSent ? (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg mt-9 mb-4">
          Reset link sent! Please check your inbox.
        </div>
      ) : (
        
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-4">
        Enter your registered email address and we'll send you instructions to reset your password.
      </p>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mt-4 mb-1.5">
            Email
          </label>
          <input
            type="email"
            defaultValue={email}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#660022]"
          />
        </div>
      )}

      <div className="flex items-center justify-end space-x-2">
        <button
          type="button"
          onClick={() => setIsForgotPasswordOpen(false)}
          className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Close
        </button>
        {!resetEmailSent && (
          <button
            type="button"
            onClick={() => setResetEmailSent(true)}
            className="px-3.5 py-2 text-xs font-medium bg-[#8d002f] hover:bg-[#660022] text-white rounded-lg transition-colors"
          >
            Send Link
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* Contact Administrator / IT Support Modal */}
{isSupportOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-left">
      <h3 className="text-lg font-bold text-slate-900 mb-1">System Administrator Support</h3>
      <p className="text-xs text-slate-500 mb-4">
        If you are locked out or need account credentials reset, reach out to the IT helpdesk:
      </p>

      <div className="space-y-2.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-5">
        <div className="flex justify-between">
          <span className="text-slate-400">IT Helpdesk Email:</span>
          <span className="font-medium text-slate-800">support@amp.org</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Support Hotline:</span>
          <span className="font-mono text-slate-800">+234 800-AMP-HELP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Operational Hours:</span>
          <span className="text-slate-800 font-medium">Mon - Fri, 8AM - 5PM</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsSupportOpen(false)}
          className="px-4 py-2 text-xs font-medium bg-[#660022] hover:bg-[#660022]/90 text-white rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
