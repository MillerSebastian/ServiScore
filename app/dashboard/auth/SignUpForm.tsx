import { useState } from "react";
import Link from "next/link";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2">
      <div className="w-full max-w-md mx-auto mb-5 pt-10">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Create an account to get started
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-2 border border-input rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-2 border border-input rounded-md"
              />
            </div>
          </div>
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
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 mt-1"
            />
            <label className="text-sm">
              I agree to the Terms and Conditions and Privacy Policy
            </label>
          </div>
          <button className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90">
            Sign Up
          </button>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
