import clsx from 'clsx';
import type { ConditionStats } from '../types/studyComponents.types';

const ConditionStatsView: React.FC<{
    conditionStats: ConditionStats[];
}> = ({ conditionStats }) => {
    if (!conditionStats || conditionStats.length === 0) {
        return <p>No conditions</p>;
    }
    if (conditionStats.length > 0) {
        return (
            <>
                {conditionStats.map((conditionCount) => (
                    <div
                        key={conditionCount.condition_id}
                        className={clsx(
                            'flex flex-between w-full p-2 align-middle items-center',
                            'border border-yellow-300 m-1 rounded-lg',
                            'bg-yellow-400'
                        )}
                    >
                        <p className={clsx('w-1/2 text-left me-3 italic')}>{conditionCount.condition_name}</p>
                        <p className={clsx('w-1/2 font-bold text-center')}>{conditionCount.participant_count}</p>
                    </div>
                ))}
            </>
        );
    }
};

export default ConditionStatsView;
