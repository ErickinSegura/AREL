import React from 'react';
import { Card, CardContent } from '../lib/ui/Card';
import { AuthHeader, FormField, FormError, AuthButton, IconEmail, IconPassword } from '../components/auth/authComponents';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const {
        user,
        errors,
        isSubmitting,
        attempts,
        showPassword,
        showConfirmPassword,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility
    } = useRegisterForm();

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
            <Card className="w-full max-w-3xl overflow-hidden flex flex-col md:flex-row shadow-lg bg-white">
                <div className="w-full p-6 sm:p-8 md:p-12">
                    <div className="max-w-xl mx-auto">
                        <AuthHeader title={"Register an user"} subtitle={"You need user's data to proceed"}/>

                        <FormError message={errors.general} />

                        <CardContent className="p-0">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        id="name"
                                        name="name"
                                        label="Name"
                                        type="text"
                                        placeholder="Name"
                                        value={user.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        disabled={isSubmitting}
                                        required
                                    />

                                    <FormField
                                        id="last_name"
                                        name="last_name"
                                        label="Last Name"
                                        type="text"
                                        placeholder="Last Name"
                                        value={user.last_name}
                                        onChange={handleChange}
                                        error={errors.last_name}
                                        disabled={isSubmitting}
                                        required
                                    />

                                    <FormField
                                        id="username"
                                        name="username"
                                        label="Telegram Username"
                                        type="text"
                                        placeholder="username"
                                        value={user.username}
                                        onChange={handleChange}
                                        error={errors.username}
                                        disabled={isSubmitting}
                                        required
                                    />

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
                                            placeholder="••••••••"
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

                                    <div className="relative">
                                        <FormField
                                            id="confirm_password"
                                            name="confirm_password"
                                            label="Confirm Password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={user.confirm_password}
                                            onChange={handleChange}
                                            error={errors.confirm_password}
                                            disabled={isSubmitting}
                                            icon={<IconPassword />}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <AuthButton
                                    isSubmitting={isSubmitting}
                                    attempts={attempts}
                                    text={"Register the new user"}
                                    loadingText={"Registering..."}
                                />
                            </form>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Register;


