import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

/* ---------------- Demo Credentials ---------------- */
const demoUsers = {
  student: {
    email: "student2@example.com",
    password: "12345",
  },
  clublead: {
    email: "student1@example.com",
    password: "12345",
  },
  faculty: {
    email: "faculty1@example.com",
    password: "12345",
  },
  admin: {
    email: "admin@example.com",
    password: "Admin123",
  },
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  /* ----------- Auto-fill Demo Credentials ----------- */
  const fillDemoCredentials = (role: keyof typeof demoUsers) => {
    setEmail(demoUsers[role].email);
    setPassword(demoUsers[role].password);
    toast({
      title: "Demo credentials loaded",
      description: `Click Sign In to continue as ${role}`,
    });
  };

  /* ---------------- Login Handler ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(email, password);

      toast({
        title: "Login successful",
        description: "Welcome to ClubHub!",
      });

      // Role-based navigation
      switch (loggedInUser.role) {
        case "student":
          navigate("/student/clubs");
          break;
        case "clublead":
          navigate("/club-lead/dashboard");
          break;
        case "faculty":
          navigate("/faculty/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your ClubHub account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* ---------- Demo Credentials Section ---------- */}
<div className="mt-6 border-t pt-4">
  <p className="text-xs text-muted-foreground text-center mb-1">
    Demo Accounts (For Recruiters & Testing)
  </p>

  <p className="text-[11px] text-muted-foreground text-center mb-3">
    Click any role below to auto-fill demo credentials, then press <b>Sign In</b>
  </p>

  <div className="grid grid-cols-2 gap-2">
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => fillDemoCredentials("student")}
    >
      Student
    </Button>

    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => fillDemoCredentials("clublead")}
    >
      Club Lead
    </Button>

    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => fillDemoCredentials("faculty")}
    >
      Faculty
    </Button>

    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => fillDemoCredentials("admin")}
    >
      Admin
    </Button>
  </div>
</div>


          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
