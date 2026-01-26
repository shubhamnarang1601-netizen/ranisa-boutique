'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllProducts, getAllOrders } from '@/lib/firebase/firestore';
import styles from './admin-dashboard.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        customers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const products = await getAllProducts();
            const orders = await getAllOrders();

            const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
            const customers = new Set(orders.map((o) => o.userId)).size;

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                revenue,
                customers,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p>Welcome to Ranisa Boutique Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🛍️</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Total Products</p>
                        <h3 className={styles.statValue}>{loading ? '...' : stats.totalProducts}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📦</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Total Orders</p>
                        <h3 className={styles.statValue}>{loading ? '...' : stats.totalOrders}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Revenue</p>
                        <h3 className={styles.statValue}>₹{loading ? '...' : stats.revenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Customers</p>
                        <h3 className={styles.statValue}>{loading ? '...' : stats.customers}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                    <Link href="/admin/products/add" className={styles.actionCard}>
                        <span className={styles.actionIcon}>➕</span>
                        <h3>Add Product</h3>
                        <p>Upload new products with images and details</p>
                    </Link>

                    <Link href="/admin/products" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📝</span>
                        <h3>Manage Products</h3>
                        <p>Edit, update, or delete existing products</p>
                    </Link>

                    <Link href="/admin/orders" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📦</span>
                        <h3>View Orders</h3>
                        <p>Check and process customer orders</p>
                    </Link>

                    <Link href="/admin/customers" className={styles.actionCard}>
                        <span className={styles.actionIcon}>👥</span>
                        <h3>Customer List</h3>
                        <p>View and manage customer information</p>
                    </Link>
                </div>
            </div>

            {/* Info Box */}
            <div className={styles.infoBox}>
                <h3>🔥 Getting Started</h3>
                <ol>
                    <li>Click <strong>&quot;Add Product&quot;</strong> to upload your first product</li>
                    <li>Upload product images (JPG, PNG)</li>
                    <li>Set price, category, description, and stock</li>
                    <li>Click &quot;Publish Product&quot; to make it live!</li>
                </ol>
                <p className={styles.note}>
                    💡 Tip: Products appear on your website instantly after publishing!
                </p>
            </div>
        </div>
    );
}
