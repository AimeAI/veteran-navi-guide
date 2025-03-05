import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { isValidEmail, isStrongPassword } from "@/utils/validation";

interface FormError {
  [key: string]: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, user } = useUser();
  
  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate("/");
    }
  }, [user, navigate]);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<FormError>({});
  
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [militaryBranch, setMilitaryBranch] = useState("");
  const [signupErrors, setSignupErrors] = useState<FormError>({});
  
  const validateLoginForm = (): boolean => {
    const errors: FormError = {};
    
    if (!loginEmail) {
      errors.email = "Email is required";
    } else if (!isValidEmail(loginEmail)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!loginPassword) {
      errors.password = "Password is required";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateSignupForm = (): boolean => {
    const errors: FormError = {};
    
    if (!signupEmail) {
      errors.email = "Email is required";
    } else if (!isValidEmail(signupEmail)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!signupPassword) {
      errors.password = "Password is required";
    } else if (!isStrongPassword(signupPassword)) {
      errors.password = "Password must be at least 8 characters with uppercase, lowercase, and numbers";
    }
    
    if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (!militaryBranch) {
      errors.militaryBranch = "Military branch is required";
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled by the UserContext with toast
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    try {
      await signup(signupEmail, signupPassword, militaryBranch);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      // Error is handled by the UserContext with toast
    }
  };

  const renderFormError = (error: string | undefined) => {
    if (!error) return null;
    
    return (
      <div className="flex items-center mt-1 text-red-500 text-sm">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={loginErrors.email ? "text-red-500" : ""}>
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginErrors.email) {
                          setLoginErrors({ ...loginErrors, email: "" });
                        }
                      }}
                      className={loginErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                      required
                    />
                    {renderFormError(loginErrors.email)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className={loginErrors.password ? "text-red-500" : ""}>
                        Password
                      </Label>
                      <a 
                        href="#" 
                        className="text-sm text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info("Password reset functionality will be implemented in a future update.");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginErrors.password) {
                          setLoginErrors({ ...loginErrors, password: "" });
                        }
                      }}
                      className={loginErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                      required
                    />
                    {renderFormError(loginErrors.password)}
                  </div>
                </CardContent>
                <CardFooter>
                  <LoadingButton 
                    type="submit" 
                    className="w-full" 
                    isLoading={isLoading}
                    loadingText="Logging in..."
                  >
                    Login
                  </LoadingButton>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Join our community of veterans and find your next opportunity
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className={signupErrors.email ? "text-red-500" : ""}>
                      Email
                    </Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (signupErrors.email) {
                          setSignupErrors({ ...signupErrors, email: "" });
                        }
                      }}
                      className={signupErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                      required
                    />
                    {renderFormError(signupErrors.email)}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="military-branch" className={signupErrors.militaryBranch ? "text-red-500" : ""}>
                      Military Branch
                    </Label>
                    <Input 
                      id="military-branch" 
                      type="text" 
                      placeholder="e.g. Army, Navy, Air Force" 
                      value={militaryBranch}
                      onChange={(e) => {
                        setMilitaryBranch(e.target.value);
                        if (signupErrors.militaryBranch) {
                          setSignupErrors({ ...signupErrors, militaryBranch: "" });
                        }
                      }}
                      className={signupErrors.militaryBranch ? "border-red-500 focus-visible:ring-red-500" : ""}
                      required
                    />
                    {renderFormError(signupErrors.militaryBranch)}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className={signupErrors.password ? "text-red-500" : ""}>
                      Password
                    </Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (signupErrors.password) {
                          setSignupErrors({ ...signupErrors, password: "" });
                        }
                      }}
                      className={signupErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                      required
                    />
                    {renderFormError(signupErrors.password)}
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={signupErrors.confirmPassword ? "text-red-500" : ""}>
                      Confirm Password
                    </Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={signupConfirmPassword}
                      onChange={(e) => {
                        setSignupConfirmPassword(e.target.value);
                        if (signupErrors.confirmPassword) {
                          setSignupErrors({ ...signupErrors, confirmPassword: "" });
                        }
                      }}
                      className={signupErrors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                      required
                    />
                    {renderFormError(signupErrors.confirmPassword)}
                  </div>
                </CardContent>
                <CardFooter>
                  <LoadingButton 
                    type="submit" 
                    className="w-full" 
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    Create Account
                  </LoadingButton>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
