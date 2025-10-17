"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthFormProps {
  onAuthSuccess?: (user: User) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  useEffect(() => {
    // Check if user is already logged in
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user && onAuthSuccess) {
        onAuthSuccess(user);
      }
    };
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        setMessage("Successfully signed in!");
        if (onAuthSuccess) {
          onAuthSuccess(session.user);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setMessage("");
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back!
          </h2>
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              Signed in as: <strong>{user.email}</strong>
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {isSignUp ? "Join GoRocky Motorcycles" : "Welcome back to GoRocky"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.includes("Successfully") ||
              message.includes("Check your email")
                ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-600 hover:text-orange-700 text-sm"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}
