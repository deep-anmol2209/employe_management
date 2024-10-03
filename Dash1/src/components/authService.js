import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Adjusted import to correct package name
import config from '../../configure';

class AuthService {
    constructor() {
        this.api = axios.create({
            baseURL: config.apiBaseUrl,
            withCredentials: true, // Important for sending cookies with requests
        });
        this.token = null; // Access token in memory
    }

    async login(credentials) {
        try {
            console.log('login start')
            const response = await this.api.post('/user/login', credentials);
            console.log("login: ", response)
            if (response.status === 200 && response.data.accesstoken) {
                this.token = response.data.accesstoken; // Store access token in memory
                console.log("Logged in successfully");
                return this.getUserFromToken();
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Ensure errors are propagated
        }
    }

    async logout() {
        try {
            await this.api.get('/user/logout');
            this.token = null;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    getToken() {
        return this.token;
    }

    getUserFromToken() {
        const token = this.getToken();
        if (token) {
            try {
                const decodedToken= jwtDecode(token)
                console.log(decodedToken)
                return {
                    id: decodedToken.id,
                    name: decodedToken.name,
                    role: decodedToken.role,
                    profile: decodedToken.profilePicture
                     
                    
                    }
            } catch (error) {
                console.error('Token decoding error:', error);
                this.token = null; // Clear token if decoding fails
                return null;
            }
        }
        return null;
    }

    async refreshToken() {
        try {
            const response = await this.api.get('user/refresh_token'); // Refresh token is sent in cookie
            if (response.status === 200 && response.data.accesstoken) {
                this.token = response.data.accesstoken; // Update access token
                return this.getUserFromToken();
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            this.logout(); // Optional: log out if refresh fails
            console.error('Refresh token error:', error);
            throw error;
        }
    }

    async fetchUser() {
        const user = this.getUserFromToken();
        if (user) {
            return user;
        } else {
            try {
                await this.refreshToken(); // Attempt to refresh token if user is not found
                return this.getUserFromToken();
            } catch (error) {
                console.error('Fetch user error:', error);
                throw new Error('No token found or unable to refresh token');
            }
        }
    }

    isAdmin() {
        const user = this.getUserFromToken();
        return user && user.role === 'admin';
    }

    isTokenExpired(token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp < Date.now() / 1000; // Check if token is expired
        } catch (error) {
            console.error('Token expiration check error:', error);
            return true; // Treat invalid tokens as expired
        }
    }

    async apiCall(endpoint, options = {}) {
        try {
            // console.log("wait")
            let token = this.getToken();
            if (!token || this.isTokenExpired(token)) {
                await this.refreshToken();
                token = this.getToken(); // Update the token after refreshing
            }
        //    console.log("still okay")
            const authHeaders = {
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };
        //   console.log("wait again")
            const response = await this.api.request({
                url: endpoint,
                ...options,
                headers: authHeaders,
            });
             console.log("response: ",response)
            return {data: response.data, status: response.status};
        } catch (err) {
            
            console.error('API call error:', err);
            console.log(err.response.data.msg)
            if (err.response) {
                return { error: err.response.data, status: err.response.status, msg: err.response.data.msg };
            } else {
                throw err; // If there's no response, throw the error
            }
        }
    }
}

export default new AuthService();
