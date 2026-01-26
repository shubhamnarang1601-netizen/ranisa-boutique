'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { registerUser } from '@/lib/firebase/auth';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const user = await registerUser(
                formData.email,
                formData.password,
                formData.name
            );
            console.log('Registration successful:', user);
            setSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to create account. Please try again.');
            } else {
                setError('Failed to create account. Please try again.');
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
                <div className={styles.registerBox}>
                    <div className={styles.header}>
                        <h1>Create Account</h1>
                        <p>Join Ranisa Boutique and start shopping</p>
                    </div>

                    {success ? (
                        <div className={styles.successBox}>
                            <div className={styles.successIcon}>✓</div>
                            <h3>Account Created Successfully!</h3>
                            <p>Redirecting to login page...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && (
                                <div className={styles.errorBox}>
                                    <span className={styles.errorIcon}>⚠️</span>
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Full Name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                }
                            />

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
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                helperText="Must be at least 6 characters"
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                }
                            />

                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                }
                            />

                            <div className={styles.terms}>
                                <input type="checkbox" id="terms" required />
                                <label htmlFor="terms">
                                    I agree to the{' '}
                                    <Link href="/terms">Terms of Service</Link> and{' '}
                                    <Link href="/privacy">Privacy Policy</Link>
                                </label>
                            </div>

                            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            <p className={styles.login}>
                                Already have an account?{' '}
                                <Link href="/login" className={styles.loginLink}>
                                    Login
                                </Link>
                            </p>
                        </form>
                    )}

                    <div className={styles.notice}>
                        <p>
                            ⚠️ <strong>Firebase Setup Required:</strong> To register, you must
                            first configure Firebase. See{' '}
                            <Link href="/setup-guide">SETUP.md</Link> for instructions.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
