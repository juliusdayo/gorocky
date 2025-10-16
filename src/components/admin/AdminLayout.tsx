"use client";

import { useState, useEffect, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "./LoadingSpinner";
import AuthRequired from "./AuthRequired";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: (user: User) => ReactNode;
  authMessage?: string;
  showDashboardLink?: boolean;
}

export default function AdminLayout({
  children,
  authMessage,
  showDashboardLink = true,
}: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthRequired message={authMessage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader
        user={user}
        onSignOut={handleSignOut}
        showDashboardLink={showDashboardLink}
      />
      <div className="flex h-screen pt-16">
        <Sidebar className="w-64 fixed h-full" />
        <main className="flex-1 ml-64 overflow-auto">{children(user)}</main>
      </div>
    </div>
  );
}
