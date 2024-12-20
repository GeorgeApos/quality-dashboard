import { useEffect, useState } from 'react';
import axios from 'axios';
import apiRoutes from '../assets/data/api_urls.json';
import {jwtDecode} from "jwt-decode";

const baseApiUrl = import.meta.env.VITE_API_BASE_URL

const resetTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

const useAuthenticationCheck = (accessToken: string | null): [boolean | null, React.Dispatch<React.SetStateAction<boolean | null>>] => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!accessToken) {
                    setIsAuthenticated(false);
                    resetTokens();
                    return;
                }

                // If the token is malformed, the API will return a 403
                let decoded = jwtDecode(accessToken);
                if (!decoded) {
                    setIsAuthenticated(false);
                    resetTokens();
                    return;
                }

                const apiURL = baseApiUrl + apiRoutes.routes.checkAuth;

                let headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                };

                const response = await axios.get(apiURL, { headers });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    resetTokens();
                }
            } catch (error) {
                let status = error.response.status;
                setIsAuthenticated(false);

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                if (status === 403) {
                    console.warn("The user is not authenticated.");
                }
                else
                    console.warn("Authentication Check Failed due to an unexpected error. " + error);
            }
        };

        fetchData();
    }, [accessToken]);

    return [isAuthenticated, setIsAuthenticated];
};

export default useAuthenticationCheck;
