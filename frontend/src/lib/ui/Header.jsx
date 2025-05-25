import {Card, CardHeader, CardTitle} from "./Card";
import {SkeletonCircle, SkeletonText} from "./Skeleton";
import React from "react";
import {FiBookmark, FiCode, FiCodesandbox, FiFileText, FiFolder, FiStar} from "react-icons/fi";

const getProjectIcon = (iconID) => {
    switch (iconID) {
        case 1: return <FiFolder size={24} />;
        case 2: return <FiCodesandbox size={24} />;
        case 3: return <FiCode size={24} />;
        case 4: return <FiFileText size={24} />;
        case 5: return <FiStar size={24} />;
        case 6: return <FiBookmark size={24} />;
        default: return <FiFolder size={24} />;
    }
};

export const Header = ({ title, marked, selectedProject, loading, props }) => (
    <Card className="mb-4 sm:mb-6">
        <CardHeader>
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${loading ? 'animate-pulse' : ''}`}>
                <CardTitle className="w-full sm:w-auto">
                    {loading ? (
                        <div className="flex items-center">
                            <SkeletonCircle size="md" />
                            <div className="ml-3 w-32 sm:w-48">
                                <SkeletonText lines={1} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center w-full">
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl grid place-items-center text-white flex-shrink-0"
                                style={{ backgroundColor: selectedProject?.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(selectedProject?.icon)}
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold sm:px-3 ml-3 sm:ml-0 break-words max-w-full truncate">
                                {title}
                                {marked && <span className="text-oracleRed"> {marked}</span>}
                            </h1>
                        </div>
                    )}
                </CardTitle>

                {!loading && props}
            </div>
        </CardHeader>
    </Card>
);
