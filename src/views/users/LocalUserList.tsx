import { useState } from 'react';
import { useApiClients } from '../../api/ApiContext';
import ResourceTable from '../../components/resources/ResourceTable';
import type { User } from '../../types/studyComponents.types';
import UserSummary from './UserSummary';

const LocalUserList = () => {
    const { localUserClient } = useApiClients();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSelect = (user: User) => {
        setSelectedUser(user);
    };

    return (
        <div className="container mx-auto p-3">
            <div className="flex space-x-2 justify-between mb-2 p-3">
                <div className="container mx-auto p-3 bg-gray-50 rounded-lg me-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold mb-4">{localUserClient.config.viewTitle}</h2>
                    </div>
                    <ResourceTable<User>
                        resourceTag={localUserClient.config.apiResourceTag}
                        queryFn={localUserClient.getPaginated}
                        columns={localUserClient.config.tableColumns!}
                        onRowClick={handleSelect}
                        selectedRowId={selectedUser?.id}
                        isSearchable={true}
                    />
                </div>

                <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2 w-1/3">
                    {selectedUser ? (
                        <UserSummary data={selectedUser} />
                    ) : (
                        <p className="text-gray-500 italic">Select a user to view details.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocalUserList;
