"use client";
import LoginForm from "@/app/_components/features/authentication/LoginForm";
import SignupForm from "@/app/_components/features/authentication/SignUpForm";

import { Link, Typography } from "@mui/material";
import { useState } from "react";

export default function Page() {
  const [isSignUp, setIsSignUp] = useState(true);
  return (
    <>
      {isSignUp ? <SignupForm /> : <LoginForm />}
      <Typography sx={{ mt: 2, fontSize: "14px" }}>
        {isSignUp ? (
          <>
            Already have account? Go to{" "}
            <Link onClick={() => setIsSignUp(false)} sx={{ cursor: "pointer" }}>
              Login
            </Link>{" "}
            Page
          </>
        ) : (
          <>
            Don&apos;t have account? Go to{" "}
            <Link onClick={() => setIsSignUp(true)} sx={{ cursor: "pointer" }}>
              Sign Up
            </Link>{" "}
            Page
          </>
        )}
      </Typography>
    </>
  );
}
