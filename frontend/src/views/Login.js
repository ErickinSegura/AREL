import React from 'react';
import { Card, CardContent } from '../lib/ui/Card';
import { AuthHeader, FormField, FormError, AuthButton, IconEmail, IconPassword } from '../components/auth/authComponents';
import { useLoginForm } from '../hooks/useLoginForm';
import {Eye, EyeOff} from "lucide-react";


const Login = () => {
    const {
        user,
        errors,
        showPassword,
        isSubmitting,
        attempts,
        handleChange,
        togglePasswordVisibility,
        handleSubmit
    } = useLoginForm();

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
            <Card className="w-full max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-lg bg-white">
                {/* Left side - Image */}
                <div className="w-full md:w-1/2 h-48 md:h-auto bg-gradient-to-br from-red-600 to-oracleRed flex items-center justify-center">
                    <img
                        src=""
                        alt=""
                        className="max-h-full object-contain p-6"
                    />
                </div>

                {/* Right side - Form */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
                    <div className="max-w-md mx-auto">
                        <AuthHeader title={"Login"} subtitle={"Login to your account"}/>

                        <FormError message={errors.general} />

                        <CardContent className="p-0">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        id="email"
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        placeholder="me@arel.com"
                                        value={user.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        disabled={isSubmitting}
                                        icon={<IconEmail />}
                                        required
                                    />

                                    <div className="relative">
                                    <FormField
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        error={errors.password}
                                        disabled={isSubmitting}
                                        icon={<IconPassword />}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    </div>
                                </div>

                                <AuthButton
                                    isSubmitting={isSubmitting}
                                    attempts={attempts}
                                    text={"Login to your account"}
                                    loadingText={"Logging in..."}
                                />
                            </form>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Login;