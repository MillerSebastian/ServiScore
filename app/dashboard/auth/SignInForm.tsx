import { useState } from "react";
import Link from "next/link";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="info@example.com"
              className="w-full px-4 py-2 border border-input rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-input rounded-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm">Keep me logged in</label>
          </div>
          <button className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90">
            Sign In
          </button>
          <p className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
