'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginUser } from '@/lib/firebase/auth';
import styles from './admin-login.module.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await loginUser(formData.email, formData.password);

            if (user.role !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }

            console.log('Admin login successful');
            router.push('/admin');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to login');
            } else {
                setError('Failed to login');
            }
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <h1>Admin Portal</h1>
                    <p>Secure login for Ranisa Boutique staff</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorBox}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <Input
                        label="Admin Email"
                        name="email"
                        type="email"
                        placeholder="admin@ranisaboutique.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoFocus
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter admin password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </Button>

                    <p className={styles.backLink}>
                        Not an admin? <a href="/login">Go to Customer Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
