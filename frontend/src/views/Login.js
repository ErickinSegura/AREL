import React from 'react';
import { Card, CardContent } from '../lib/ui/Card';
import { LoginHeader, FormError, FormField, LoginButton, IconPassword, IconEmail } from '../components/auth/loginComponents';
import { useLoginForm } from '../hooks/useLoginForm';

const Login = () => {
    const { user, errors, isSubmitting, attempts, handleChange, handleSubmit } = useLoginForm();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
            <Card className="w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
                {/* Lado izquierdo - Imagen */}
                <div className="w-full md:w-1/2 h-48 md:h-auto bg-oracleRed flex items-center justify-center">
                    {/* Imagen */}
                </div>

                {/* Lado derecho - Formulario */}
                <div className="w-full md:w-3/4 p-6 sm:p-8 md:p-12">
                    <div className="max-w-md mx-auto">
                        <LoginHeader />

                        <FormError message={errors.general} />

                        <CardContent className="p-0">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        id="email"
                                        label="Email"
                                        type="email"
                                        placeholder="me@arel.com"
                                        value={user.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        disabled={isSubmitting}
                                        icon={<IconEmail />}
                                    />

                                    <FormField
                                        id="password"
                                        label="Password"
                                        type="password"
                                        placeholder="Password"
                                        value={user.password}
                                        onChange={handleChange}
                                        error={errors.password}
                                        disabled={isSubmitting}
                                        icon={<IconPassword />}
                                    />
                                </div>

                                <LoginButton
                                    isSubmitting={isSubmitting}
                                    attempts={attempts}
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