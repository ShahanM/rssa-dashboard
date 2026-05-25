import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useApi } from '../../hooks/useApi';

interface StudyDemographicsProps {
    studyId: string;
}

// Expected response: { "age_range": { "18-24": 15, "25-34": 30 }, "gender": { "Male": 40 } }
type DemographicSummaryData = Record<string, Record<string, number>>;

const StudyDemographics: React.FC<StudyDemographicsProps> = ({ studyId }) => {
    const { api } = useApi();

    const { data, isLoading, error } = useQuery({
        queryKey: ['study', studyId, 'demographics-summary'],
        queryFn: () => api.get<DemographicSummaryData>(`studies/${studyId}/demographics/summary`),
    });

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Loading aggregate demographics...</div>;
    }

    if (error || !data) {
        return <div className="p-8 text-center text-red-500">Failed to load demographic data.</div>;
    }

    const formatCategoryName = (key: string) => {
        return key
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {Object.entries(data).map(([categoryName, distribution]) => {
                const totalInCategory = Object.values(distribution).reduce((acc, count) => acc + count, 0);

                return (
                    <div key={categoryName} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                            {formatCategoryName(categoryName)}
                        </h3>

                        {totalInCategory === 0 ? (
                            <p className="text-sm text-gray-500 italic">No data recorded.</p>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(distribution)
                                    .sort(([, countA], [, countB]) => countB - countA)
                                    .map(([label, count]) => {
                                        const percentage = Math.round((count / totalInCategory) * 100);
                                        return (
                                            <div key={label}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-gray-700">{label}</span>
                                                    <span className="text-gray-500">
                                                        {count} ({percentage}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-500 h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StudyDemographics;
