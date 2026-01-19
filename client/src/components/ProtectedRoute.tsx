import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useFirebaseAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD60A]" />
      </div>
    );
  }

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  return <>{children}</>;
}
