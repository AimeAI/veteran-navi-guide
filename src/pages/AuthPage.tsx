import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { AlertCircle, Building, Briefcase, User } from "lucide-react";
import { isValidEmail, isStrongPassword } from "@/utils/validation";
import FormErrorMessage from "@/components/ui/form-error-message";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";
import SocialLoginButtons from "@/components/ui/SocialLoginButtons";

interface FormError {
  [key: string]: string;
}

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup, socialLogin, isLoading, user } = useUser();
  
  useEffect(() => {
    if (user?.isAuthenticated) {
      if (!user.emailVerified) {
        navigate("/verify-email");
      } else {
        if (user.role === "employer") {
          navigate("/employer/manage-applications");
        } else {
          navigate("/");
        }
      }
    }
  }, [user, navigate]);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginAsEmployer, setLoginAsEmployer] = useState(false);
  const [loginErrors, setLoginErrors] = useState<FormError>({});
  
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [militaryBranch, setMilitaryBranch] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [userType, setUserType] = useState<"veteran" | "employer">("veteran");
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
    
    if (userType === "veteran" && !militaryBranch) {
      errors.militaryBranch = "Military branch is required";
    }
    
    if (userType === "employer" && !companyName) {
      errors.companyName = "Company name is required";
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
      await login(loginEmail, loginPassword, loginAsEmployer);
      
      if (loginAsEmployer) {
        navigate("/employer/manage-applications");
      } else {
        navigate("/");
      }
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
      await signup(
        signupEmail, 
        signupPassword, 
        userType === "veteran" ? militaryBranch : "", 
        userType === "employer",
        userType === "employer" ? companyName : undefined
      );
      
      if (userType === "employer") {
        navigate("/employer/manage-applications");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      // Error is handled by the UserContext with toast
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      await socialLogin(provider, userType === "employer");
      
      if (userType === "employer") {
        navigate("/employer/manage-applications");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      // Error is handled by the UserContext with toast
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">{t('common.login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('common.signup')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.welcomeBack')}</CardTitle>
                <CardDescription>
                  {t('auth.enterCredentials')}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={loginErrors.email ? "text-red-500" : ""}>
                      {t('auth.email')}
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
                    <FormErrorMessage message={loginErrors.email} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className={loginErrors.password ? "text-red-500" : ""}>
                        {t('auth.password')}
                      </Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-primary hover:underline"
                      >
                        {t('auth.forgotPassword')}
                      </Link>
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
                    <FormErrorMessage message={loginErrors.password} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="login-as-employer"
                        checked={loginAsEmployer}
                        onChange={(e) => setLoginAsEmployer(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="login-as-employer" className="font-normal">
                        <Building className="h-4 w-4 inline mr-1" />
                        {t('auth.loginAsEmployer')}
                      </Label>
                    </div>
                  </div>
                  <SocialLoginButtons 
                    onSocialLogin={handleSocialLogin}
                    isLoading={isLoading}
                  />
                </CardContent>
                <CardFooter>
                  <LoadingButton 
                    type="submit" 
                    className="w-full" 
                    isLoading={isLoading}
                    loadingText="Logging in..."
                  >
                    {t('common.login')}
                  </LoadingButton>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.createAccount')}</CardTitle>
                <CardDescription>
                  {t('auth.signUpToJoin')}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-type">{t('auth.accountType')}</Label>
                    <RadioGroup 
                      value={userType} 
                      onValueChange={(value) => setUserType(value as "veteran" | "employer")}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="veteran" id="veteran" />
                        <Label htmlFor="veteran" className="flex items-center cursor-pointer">
                          <User className="h-4 w-4 mr-1" />
                          {t('auth.veteran')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="employer" id="employer" />
                        <Label htmlFor="employer" className="flex items-center cursor-pointer">
                          <Building className="h-4 w-4 mr-1" />
                          {t('auth.employer')}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className={signupErrors.email ? "text-red-500" : ""}>
                      {t('auth.email')}
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
                    <FormErrorMessage message={signupErrors.email} />
                  </div>
                  
                  {userType === "veteran" ? (
                    <div className="space-y-2">
                      <Label htmlFor="military-branch" className={signupErrors.militaryBranch ? "text-red-500" : ""}>
                        {t('auth.militaryBranch')}
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
                        required={userType === "veteran"}
                      />
                      <FormErrorMessage message={signupErrors.militaryBranch} />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className={signupErrors.companyName ? "text-red-500" : ""}>
                        {t('auth.companyName')}
                      </Label>
                      <Input 
                        id="company-name" 
                        type="text" 
                        placeholder="e.g. TechVets Solutions Inc." 
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          if (signupErrors.companyName) {
                            setSignupErrors({ ...signupErrors, companyName: "" });
                          }
                        }}
                        className={signupErrors.companyName ? "border-red-500 focus-visible:ring-red-500" : ""}
                        required={userType === "employer"}
                      />
                      <FormErrorMessage message={signupErrors.companyName} />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className={signupErrors.password ? "text-red-500" : ""}>
                      {t('auth.password')}
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
                    <FormErrorMessage message={signupErrors.password} />
                    <p className="text-xs text-gray-500">
                      {t('auth.passwordRequirements')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={signupErrors.confirmPassword ? "text-red-500" : ""}>
                      {t('auth.confirmPassword')}
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
                    <FormErrorMessage message={signupErrors.confirmPassword} />
                  </div>
                  <SocialLoginButtons 
                    onSocialLogin={handleSocialLogin}
                    isLoading={isLoading}
                  />
                </CardContent>
                <CardFooter>
                  <LoadingButton 
                    type="submit" 
                    className="w-full" 
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    {t('common.signup')}
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
