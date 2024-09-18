import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const saveMessage = async (messageData) => {
    try {
        const response = await axios.post(`${API_URL}/envio`, messageData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};
