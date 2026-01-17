import { useState, useEffect } from 'react';

/**
 * @deprecated Use useUsers from './useUsers' instead
 * This file will be removed after migration is complete
 *
 * Migration example:
 * OLD: const userData = UserData();
 * NEW: const { data: userData, isLoading, error } = useUsers();
 */
export const UserData = () => {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user/data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUsers();
    }, []);

    return userData;
}

/**
 * @deprecated Use useUser from './useUsers' instead
 * This file will be removed after migration is complete
 *
 * Migration example:
 * OLD: const user = useUser(userId);
 * NEW: const { data: user, isLoading, error } = useUser(userId);
 */
export const useUser = (userId: string) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, [userId]);

    return user;
}