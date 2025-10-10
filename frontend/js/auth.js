const API_BASE = 'http://localhost:5000/api';

class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    async register(name, email, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                this.user = data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                return { success: true, data };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please check if backend is running.' };
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                this.user = data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                return { success: true, data };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please check if backend is running.' };
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
}

const auth = new Auth();