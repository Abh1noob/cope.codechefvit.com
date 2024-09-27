"use client";
import { cn } from "@/lib/utils";
import { errorToast } from "@/utils/errors";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";

// Validation schema for signup
const signupSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(50, { message: "Email address too long" }),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name is too long" }),
  regno: z
    .string()
    .min(4, { message: "Registration number must be at least 4 characters" })
    .max(20, { message: "Registration number too long" }),
  role: z.enum(["user", "admin"], { message: "Role is required" }),
});

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [regno, setRegno] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data using Zod schema
    const result = signupSchema.safeParse({ email, name, regno, role });

    if (!result.success) {
      const formErrors = result.error.format();
      if (formErrors.email?._errors[0]) {
        toast.error(formErrors.email._errors[0]);
      }
      if (formErrors.name?._errors[0]) {
        toast.error(formErrors.name._errors[0]);
      }
      if (formErrors.regno?._errors[0]) {
        toast.error(formErrors.regno._errors[0]);
      }
      if (formErrors.role?._errors[0]) {
        toast.error(formErrors.role._errors[0]);
      }
      setLoading(false);
      return;
    }

    // Handle special case for role = "admin"
    if (role === "admin") {
      toast.success("Aukaad mein rehe bsdk");
      setLoading(false);
      return;
    }

    try {
      // Send data to API
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_CLIENTVAR}/user/signup`,
        {
          email: email.trim(),
          name: name.trim(),
          reg_no: regno.trim(),
          fuck_you: "cooking",
        }
      );

      toast.success("Signup successful!");
      setGeneratedPassword(data.password); // Store the generated password
    } catch (e) {
      errorToast(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="mt-8 flex h-screen flex-col items-center bg-white">
      <ToastContainer position="top-right" />
      <main className="w-full max-w-md rounded-lg bg-white p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold text-black">
          Signup
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSignupSubmit}>
          {/* Email Input */}
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-semibold tracking-wider text-black"
            >
              Enter VIT Mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="VIT email ID"
              className="h-[50px] w-full text-black rounded-lg border border-gray-300 bg-gray-200 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Name Input */}
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-sm font-semibold tracking-wider text-black"
            >
              Enter Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              className="h-[50px] w-full text-black rounded-lg border border-gray-300 bg-gray-200 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Registration Number Input */}
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="regno"
              className="mb-1 text-sm font-semibold tracking-wider text-black"
            >
              Enter Registration Number
            </label>
            <input
              id="regno"
              type="text"
              placeholder="Registration Number"
              className="h-[50px] w-full  text-black rounded-lg border border-gray-300 bg-gray-200 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={regno}
              onChange={(e) => setRegno(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <label className="mb-1 text-sm font-semibold tracking-wider text-black">
            Select Role
          </label>
          <div className="flex items-center">
            <input
              id="user"
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
              className="mr-2"
            />
            <label htmlFor="user" className="mr-4 text-black">
              User
            </label>
            <input
              id="admin"
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
              className="mr-2"
            />
            <label htmlFor="admin" className="text-black">
              Admin
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={cn(
              "text-md h-[50px] w-full rounded-lg bg-[#FBB3C0] px-3 font-medium text-black",
              loading && "text-black",
              !loading && "transition-all duration-300 active:scale-[0.97]"
            )}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {/* Show generated password after successful signup */}
        {generatedPassword && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-center text-black">
            <h3 className="mb-2 text-lg font-bold">Your Password</h3>
            <p className="text-md font-mono">{generatedPassword}</p>
            <button
              onClick={() => {
                if (generatedPassword) {
                  navigator.clipboard.writeText(generatedPassword);
                  toast.success("Password copied to clipboard!");
                }
              }}
              className="mt-2 rounded-lg bg-blue-200 px-4 py-2 text-black "
            >
              Copy Password
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
