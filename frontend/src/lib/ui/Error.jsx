import {Card, CardContent, CardHeader, CardTitle} from "./Card";
import {FiAlertTriangle} from "react-icons/fi";
import React from "react";

export const ErrorState = ({ error }) => (
    <div className="p-6 flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Error <span className="text-oracleRed">Loading Data</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <FiAlertTriangle size={32} />
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </CardContent>
        </Card>
    </div>
);