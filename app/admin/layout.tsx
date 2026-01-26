'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth, getCurrentUser } from '@/lib/firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './admin-layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

    useEffect(() => {
        // Skip auth check logic if on login page
        if (pathname === '/admin/login') {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                router.push('/admin/login');
                return;
            }

            const userData = await getCurrentUser();
            if (!userData || userData.role !== 'admin') {
                router.push('/login');
                return;
            }

            setUser(userData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, pathname]);

    // If we are on the login page, don't show the admin layout/sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading admin panel...</p>
            </div>
        );
    }

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Ranisa Admin</h2>
                    <p>Boutique Manager</p>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navLink}>
                        <span className={styles.icon}>📊</span>
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className={styles.navLink}>
                        <span className={styles.icon}>🛍️</span>
                        Products
                    </Link>
                    <Link href="/admin/products/add" className={styles.navLink}>
                        <span className={styles.icon}>➕</span>
                        Add Product
                    </Link>
                    <Link href="/admin/orders" className={styles.navLink}>
                        <span className={styles.icon}>📦</span>
                        Orders
                    </Link>
                    <Link href="/admin/customers" className={styles.navLink}>
                        <span className={styles.icon}>👥</span>
                        Customers
                    </Link>
                </nav>

                <div className={styles.user}>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{user?.name || 'Admin'}</p>
                        <p className={styles.userEmail}>{user?.email}</p>
                    </div>
                    <Link href="/" className={styles.backButton}>
                        ← Back to Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.content}>{children}</div>
            </main>
        </div>
    );
}

