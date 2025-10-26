import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PawPrint } from "lucide-react";
import { projectId } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface AuthPageProps {
  onAuthSuccess: (accessToken: string, user: any) => void;
  onNavigate: (page: string) => void;
}

export function AuthPage({ onAuthSuccess, onNavigate }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Sign up form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRole, setSignupRole] = useState<"user" | "admin">("user");

  // Sign in form state
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting signup with:', { email: signupEmail, name: signupName, role: signupRole });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: signupEmail,
            password: signupPassword,
            name: signupName,
            role: signupRole,
          }),
        }
      );

      const data = await response.json();
      console.log('Signup response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || `Sign up failed with status ${response.status}`);
      }

      toast.success("Account created successfully! Please sign in.");
      
      // Clear form
      setSignupEmail("");
      setSignupPassword("");
      setSignupName("");
      
      // Switch to sign in tab
      const signinTab = document.querySelector('[value="signin"]') as HTMLElement;
      signinTab?.click();
    } catch (error: any) {
      console.error('Sign up error details:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting signin with:', { email: signinEmail });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/auth/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: signinEmail,
            password: signinPassword,
          }),
        }
      );

      const data = await response.json();
      console.log('Signin response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || `Sign in failed with status ${response.status}`);
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      onAuthSuccess(data.accessToken, data.user);
    } catch (error: any) {
      console.error('Sign in error details:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setSigninEmail(email);
    setSigninPassword(password);
    
    // Trigger signin after a brief delay to allow state to update
    setTimeout(async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/auth/signin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          // If demo account doesn't exist, try seeding first
          if (data.error?.includes('Invalid') || data.error?.includes('not found')) {
            toast.error('Demo accounts not found. Click "Setup Demo Accounts" button first.');
          } else {
            throw new Error(data.error || 'Sign in failed');
          }
          setIsLoading(false);
          return;
        }

        toast.success(`Welcome back, ${data.user.name}!`);
        onAuthSuccess(data.accessToken, data.user);
      } catch (error: any) {
        console.error('Demo login error:', error);
        toast.error(error.message || 'Failed to sign in');
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  const handleSeedAccounts = async () => {
    setIsSeeding(true);
    
    try {
      console.log('Seeding demo accounts...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/seed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('Seed response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create demo accounts');
      }

      toast.success('Demo accounts created! You can now sign in.');
    } catch (error: any) {
      console.error('Seed error:', error);
      // Don't show error if accounts already exist
      if (error.message?.includes('already registered')) {
        toast.success('Demo accounts already exist! You can sign in now.');
      } else {
        toast.error(error.message || 'Failed to create demo accounts');
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <PawPrint className="w-8 h-8 text-primary" />
          </div>
          <h2 className="mb-2">Pet Trader</h2>
          <p className="text-muted-foreground">
            South Africa's trusted pet marketplace
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your Pet Trader account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signinEmail}
                      onChange={(e) => setSigninEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full rounded-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground space-y-3">
                    <p>Try demo accounts:</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDemoLogin('admin@pettrader.co.za', 'admin123')}
                        disabled={isLoading}
                      >
                        Admin Demo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDemoLogin('user@pettrader.co.za', 'user123')}
                        disabled={isLoading}
                      >
                        User Demo
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join Pet Trader to buy, sell, or adopt pets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Account Type</Label>
                    <select
                      id="signup-role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value as "user" | "admin")}
                    >
                      <option value="user">User (Buy/Adopt Pets)</option>
                      <option value="admin">Admin (Manage Marketplace)</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full rounded-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6 space-y-3">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate("landing")}
            className="text-sm"
          >
            Continue as guest
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p className="mb-2">First time? Setup demo accounts:</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSeedAccounts}
              disabled={isSeeding}
            >
              {isSeeding ? 'Setting up...' : 'Setup Demo Accounts'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
