import { useState } from "react";
import { useNavigate } from 'react-router';
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from '../context/AuthContext';
import * as tabs from '../components/ui/tabs'
import * as accordion from '../components/ui/accordion'
const SignUpSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const SignInSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

// Mock API Call (Simulation)
// A unified mock function to simulate server response
const mockAuthApi = async (path, data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (path === 'signup') {
                if (data.email === "test@example.com") {
                    return reject({ message: "Email already taken." });
                }
                resolve({ success: true, message: "Sign-up successful! JWT granted." });
            } else if (path === 'signin') {
                if (data.email === "user@example.com" && data.password === "password123") {
                    resolve({ success: true, message: "Sign-in successful! JWT granted." });
                }
                reject({ message: "Invalid email or password." });
            }
        }, 1000);
    });
};

const Authentication = () => {
    // Separate state for Sign Up and Sign In data
    const [signUpData, setSignUpData] = useState({ email: "", password: "", confirmPassword: "" });
    const [signInData, setSignInData] = useState({ email: "", password: "" });

    // Unified state for errors and loading
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("signup"); // Use state to manage the active tab
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInput = (e, formType) => {
        const { name, value } = e.target;
        // Update the correct state based on formType
        if (formType === 'signup') {
            setSignUpData((prev) => ({ ...prev, [name]: value }));
        } else {
            setSignInData((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: undefined, server: undefined }));
    };

    const handleSubmit = async (e, formType) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            let parsedData;
            let apiPath;
            let dataToSend;

            if (formType === 'signup') {
                parsedData = SignUpSchema.parse(signUpData);
                apiPath = 'signup';
                dataToSend = { email: parsedData.email, password: parsedData.password };
            } else {
                parsedData = SignInSchema.parse(signInData);
                apiPath = 'signin';
                dataToSend = parsedData;
            }

            // API Call
            const result = await mockAuthApi(apiPath, dataToSend);
            console.log(`${formType} successful:`, result.message);

            // On success, create a minimal user object and persist via context
            const userObj = { email: dataToSend.email, authenticatedAt: Date.now(), method: apiPath };
            try {
                login(userObj);
                // Redirect to dashboard after successful login
                navigate('/dashboard', { replace: true });
            } catch (e) {
                console.warn('Login call failed', e);
            }
            // TODO: Store token, redirect user

        } catch (err) {
            // Zod validation errors
            if (err instanceof z.ZodError) {
                const fieldErrors = {};
                // zod exposes validation details in .errors (array) or .issues depending on version/shape
                const validationArray = Array.isArray(err.errors)
                    ? err.errors
                    : Array.isArray(err.issues)
                        ? err.issues
                        : [];

                if (validationArray.length) {
                    validationArray.forEach((e) => {
                        const path = e.path?.[0] || "form";
                        fieldErrors[path] = e.message;
                    });
                } else {
                    // Fallback message if shape is unexpected
                    fieldErrors.form = 'Validation failed';
                }

                setErrors(fieldErrors);
            }
            // Mock API / Server errors
            else if (err && err.message) {
                setErrors({ server: err.message });
            }
            else {
                setErrors({ server: "An unexpected error occurred." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen py-10 px-14 bg-gradient-to-br from-zinc-100 to-slate-100">
            <div className="max-w-md mx-auto p-4 w-full pt-10">

                {/* Accordion (Helper Info) */}
                <accordion.Accordion type="single" collapsible className="mb-6">
                    <accordion.AccordionItem value='info'>
                        <accordion.AccordionTrigger className='text-red-400 cursor-pointer dark:text-zinc-100'>
                            Remember this is only free usage so there's no 3rd party sign-up
                        </accordion.AccordionTrigger>
                        <accordion.AccordionContent>
                            <p className="text-zinc-600 pl-4 py-2 text-sm">For visitor: this application uses JWT for the authentication process. </p>
                            <bar />
                            <p className="text-zinc-600 pl-4 py-2 text-sm">No need to verify.</p>
                        </accordion.AccordionContent>
                    </accordion.AccordionItem>
                </accordion.Accordion>

                {/* Global Server Error Message */}
                {errors.server && <p className="text-base text-red-500 mb-4">{errors.server}</p>}

                {/* --- TABS COMPONENT --- */}
                <tabs.Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                    {/* Tabs List (The buttons to switch between views) */}
                    <tabs.TabsList className="grid w-full grid-cols-2 mb-6">
                        <tabs.TabsTrigger value="signin">Sign In</tabs.TabsTrigger>
                        <tabs.TabsTrigger value="signup">Sign Up</tabs.TabsTrigger>
                    </tabs.TabsList>

                    {/* --- SIGN UP CONTENT --- */}
                    <tabs.TabsContent value="signup">
                        <h3 className="text-lg font-medium mb-4">Create an Account</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">

                            {/* Email */}
                            <div>
                                <label className="block text-sm mb-1">Email</label>
                                <Input
                                    name="email"
                                    value={signUpData.email}
                                    onChange={(e) => handleInput(e, 'signup')}
                                    placeholder="you@example.com"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm mb-1">Password</label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={signUpData.password}
                                    onChange={(e) => handleInput(e, 'signup')}
                                    placeholder="Enter a secure password"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm mb-1">Confirm Password</label>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    value={signUpData.confirmPassword}
                                    onChange={(e) => handleInput(e, 'signup')}
                                    placeholder="Repeat your password"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Signing Up..." : "Sign up"}
                            </Button>
                        </form>
                    </tabs.TabsContent>

                    {/* --- SIGN IN CONTENT --- */}
                    <tabs.TabsContent value="signin">
                        <h3 className="text-lg font-medium mb-4">Sign In</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-4">

                            {/* Email */}
                            <div>
                                <label className="block text-sm mb-1">Email</label>
                                <Input
                                    name="email"
                                    value={signInData.email}
                                    onChange={(e) => handleInput(e, 'signin')}
                                    placeholder="user@example.com"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm mb-1">Password</label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={signInData.password}
                                    onChange={(e) => handleInput(e, 'signin')}
                                    placeholder="Enter your password"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Signing In..." : "Sign in"}
                            </Button>
                        </form>
                    </tabs.TabsContent>
                </tabs.Tabs>
            </div>
        </div>
    );
};

export default Authentication;