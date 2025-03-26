import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../lib/ui/Card";

const Settings = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p>Contenido de la vista Settings</p>

            <Card>
                <CardHeader>
                    <CardTitle>Título de la tarjeta</CardTitle>
                    <CardDescription>Descripción de la tarjeta</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Contenido principal de la tarjeta</p>
                </CardContent>
                <CardFooter>
                    <p>Pie de página con botones u otras acciones</p>
                </CardFooter>
            </Card>
        </div>


    );
};

export default Settings;