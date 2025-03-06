
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { isValidEmail } from "@/utils/validation";
import { Link } from "react-router-dom";
import LoadingButton from "./ui/LoadingButton";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - in a real app with Supabase, this would be:
      // await supabase.auth.resetPasswordForEmail(email)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate success
      setIsSubmitted(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Error sending reset email:", error);
      setError("Failed to send reset email. Please try again.");
      toast.error("Failed to send reset email", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {!isSubmitted 
              ? "Enter your email and we'll send you a link to reset your password." 
              : "Check your email for a link to reset your password."}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={error ? "text-red-500" : ""}>
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                    autoComplete="email"
                    required
                  />
                  {error && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <LoadingButton 
                type="submit" 
                className="w-full" 
                isLoading={isLoading}
                loadingText="Sending reset link..."
              >
                Send Reset Link
              </LoadingButton>
              <Link to="/auth" className="text-sm text-primary hover:underline flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Check Your Email</h3>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  If you don't see it in your inbox, please check your spam folder.
                </p>
              </div>
              <div className="pt-4 w-full">
                <Link to="/auth" className="text-sm text-primary hover:underline flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
