import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useApi } from '../../hooks/useApi';

type UserProfile = {
    picture?: string;
    name?: string;
    nickname?: string;
};

interface UserCardProps {
    userId: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
    const { api } = useApi();

    const {
        data: profile,
        isLoading,
        isError,
    } = useQuery<UserProfile>({
        queryKey: ['user-profile', userId],
        queryFn: async () => {
            const result = await api.get<UserProfile>(`users/${userId}/profile`);
            if (result === null) {
                throw new Error(`User profile not found for ID: ${userId}`);
            }
            return result;
        },
        enabled: !!userId,
    });

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (isError || !profile) {
        return <div>Could not load profile.</div>;
    }

    return (
        <div className="flex items-center space-x-2">
            <img
                src={profile.picture}
                alt={profile.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span>{profile.name || profile.nickname}</span>
        </div>
    );
};

export default UserCard;
