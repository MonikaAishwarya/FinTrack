import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/fraud";

export const getFraudAlerts = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/alerts`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};