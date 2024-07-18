import axios from 'axios';

const API_URL = 'http://localhost:8080/chat';

export default {
    // Startet eine neue Chat-Sitzung
    async startChat(customerId) {
        try {
            console.log(`Sending startChat request with customerId:`, customerId);
            const response = await axios.post(`${API_URL}/start`, customerId);
            console.log('startChat response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in startChat:', error);
            throw error;
        }
    },

    // Sendet eine Nachricht an das Backend
    async sendMessage(message) {
        try {
            console.log(`Sending sendMessage request with message:`, message);
            const response = await axios.post(`${API_URL}/send`, message);
            console.log('sendMessage response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in sendMessage:', error);
            throw error;
        }
    },

    // Holt alle Nachrichten einer bestimmten Sitzung vom Backend
    async getMessages(sessionId) {
        try {
            console.log(`Sending getMessages request with sessionId: ${sessionId}`);
            const response = await axios.get(`${API_URL}/messages/${sessionId}`);
            console.log('getMessages response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in getMessages:', error);
            throw error;
        }
    },

    // Holt die Antwort des Chatbots vom Backend
    async getChatbotResponse(prompt) {
        const response = await axios.post(`${API_URL}/chatbot`, { prompt });
        return response.data;
    }
};
