import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserAPI = () => {
    const [isLogged, setIsLogged] = useState(false);

    const getAccessToken = async () => {
        try {
            const response = await axios.post('/user/refresh_token');
            return response.data.accesstoken;
        } catch (err) {
            console.error("Failed to refresh token", err);
            // Handle token refresh failure
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            let token = localStorage.getItem('token');
            if (!token) {
                token = await getAccessToken();
                localStorage.setItem('token', token);
            }
            
            if (token) {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    setIsLogged(true);
                } catch (err) {
                    console.error("Failed to fetch user info", err);
                }
            }
        };

        fetchUser();
    }, []);

    return {
        isLogged: [isLogged, setIsLogged],
    };
};

export default UserAPI;
