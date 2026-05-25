import clsx from 'clsx';
import { useMemo } from 'react';
import type { ConditionStats } from '../types/studyComponents.types';

const ConditionStatsView: React.FC<{
    conditionStats: ConditionStats[];
    showPctBars?: boolean;
}> = ({ conditionStats, showPctBars = false }) => {
    const totalParticipants = useMemo(
        () => conditionStats.reduce((acc, obj) => acc + obj.participant_count, 0),
        [conditionStats]
    );

    if (!conditionStats || conditionStats.length === 0) {
        return <p>No conditions</p>;
    }

    if (conditionStats.length > 0) {
        return (
            <>
                <div className="">
                    {showPctBars
                        ? [...conditionStats]
                              .sort((obj1, obj2) => obj1.participant_count - obj2.participant_count)
                              .map((obj) => {
                                  const percentage = Math.round((obj.participant_count / totalParticipants) * 100);
                                  return (
                                      <div key={obj.study_condition_id}>
                                          <div className="flex justify-between text-sm mb-1">
                                              <span className="font-medium text-gray-700">
                                                  {obj.study_condition_name}
                                              </span>
                                              <span className="text-gray-500">
                                                  {obj.participant_count} ({percentage}%)
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
                              })
                        : [...conditionStats]
                              .sort((obj1, obj2) => obj1.participant_count - obj2.participant_count)
                              .map((obj) => (
                                  <div
                                      key={obj.study_condition_id}
                                      className={clsx(
                                          'flex flex-between w-full p-1 align-middle items-center',
                                          'border border-amber-300 m-1 rounded-md',
                                          'bg-slate-300'
                                      )}
                                  >
                                      <p className={clsx('w-2/3 text-left me-3 italic')}>{obj.study_condition_name}</p>
                                      <p className={clsx('w-1/3 font-bold text-end me-6')}>{obj.participant_count}</p>
                                  </div>
                              ))}
                </div>
            </>
        );
    }
};

export default ConditionStatsView;
