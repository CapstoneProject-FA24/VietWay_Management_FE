import baseURL from '@api/BaseURL';
import axios from 'axios';

export const login = async (credentials) => {
    try {
        const loginRequest = {
            emailOrPhone: credentials.email,
            password: credentials.password
        };
        const response = await axios.post(`${baseURL}/api/account/login`, loginRequest);
        const data = response.data;
        if (data.data) {
            localStorage.setItem('token', data.data/*data.data.token */);
            localStorage.setItem('role', 'quan-ly'/* data.data.role */);
        }
        return {
            token: data.data,
            role: 'quan-ly'/* data.data.role */
        };
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const registerRequest = {
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
            fullName: userData.fullName,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            provinceId: userData.provinceId
        };
        const response = await axios.post(`${baseURL}/api/account/register`, registerRequest);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};