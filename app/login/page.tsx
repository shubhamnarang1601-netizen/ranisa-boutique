'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginUser } from '@/lib/firebase/auth';
import styles from './login.module.css';

export default function LoginPage() {
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
            console.log('Login successful:', user);

            // Redirect based on user role
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/profile');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to login. Please check your credentials.');
            } else {
                setError('Failed to login. Please check your credentials.');
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
        <Layout>
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <div className={styles.header}>
                        <h1>Welcome Back</h1>
                        <p>Login to your Ranisa Boutique account</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.errorBox}>
                                <span className={styles.errorIcon}>⚠️</span>
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            icon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            }
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            icon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            }
                        />

                        <div className={styles.forgotPassword}>
                            <Link href="/forgot-password">Forgot password?</Link>
                        </div>

                        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <div className={styles.divider}>
                            <span>or</span>
                        </div>

                        <p className={styles.signup}>
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className={styles.signupLink}>
                                Create Account
                            </Link>
                        </p>
                    </form>

                    <div className={styles.demo}>
                        <h4>🔥 Demo Credentials</h4>
                        <div className={styles.demoBox}>
                            <p>
                                <strong>Admin:</strong> admin@ranisaboutique.com / admin123
                            </p>
                            <p>
                                <strong>User:</strong> user@example.com / user123
                            </p>
                        </div>
                        <p className={styles.note}>
                            ⚠️ To use login, you must first set up Firebase (see SETUP.md)
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
