'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './shop.module.css';
import Link from 'next/link';
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

// Demo products data
const DEMO_PRODUCTS = [
    {
        id: '1',
        name: 'Silk Saree - Royal Pink',
        price: 2999,
        category: 'sarees',
        image: '🥻',
        newArrival: true,
    },
    {
        id: '2',
        name: 'Designer Salwar Suit - Blue',
        price: 3499,
        category: 'salwar-suits',
        image: '👘',
        newArrival: false,
    },
    {
        id: '3',
        name: 'Bridal Lehenga - Gold',
        price: 8999,
        category: 'lehengas',
        image: '👗',
        newArrival: true,
    },
    {
        id: '4',
        name: 'Cotton Kurti - Floral',
        price: 1299,
        category: 'kurtis',
        image: '👚',
        newArrival: false,
    },
    {
        id: '5',
        name: 'Evening Gown - Purple',
        price: 4999,
        category: 'gowns',
        image: '💃',
        newArrival: true,
    },
    {
        id: '6',
        name: 'Elegant Silk Saree - Green',
        price: 3299,
        category: 'sarees',
        image: '🥻',
        newArrival: false,
    },
    {
        id: '7',
        name: 'Anarkali Suit - Red',
        price: 3999,
        category: 'salwar-suits',
        image: '👘',
        newArrival: true,
    },
    {
        id: '8',
        name: 'Designer Lehenga - Pink',
        price: 7499,
        category: 'lehengas',
        image: '👗',
        newArrival: false,
    },
    {
        id: '9',
        name: 'Indo-Western Kurti',
        price: 1599,
        category: 'kurtis',
        image: '👚',
        newArrival: true,
    },
];

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Filter products
    const filteredProducts =
        selectedCategory === 'all'
            ? DEMO_PRODUCTS
            : DEMO_PRODUCTS.filter((p) => p.category === selectedCategory);

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // newest (default order)
    });

    return (
        <Layout>
            {/* Header */}
            <section className={styles.header}>
                <div className="container">
                    <h1>Shop Our Collection</h1>
                    <p>Discover exquisite ethnic wear for every occasion</p>
                </div>
            </section>

            {/* Filters & Products */}
            <section className={styles.shop}>
                <div className="container">
                    <div className={styles.shopLayout}>
                        {/* Sidebar Filters */}
                        <aside className={styles.sidebar}>
                            <div className={styles.filterSection}>
                                <h3>Categories</h3>
                                <div className={styles.filterOptions}>
                                    <button
                                        className={`${styles.filterButton} ${selectedCategory === 'all' ? styles.active : ''
                                            }`}
                                        onClick={() => setSelectedCategory('all')}
                                    >
                                        All Products
                                    </button>
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            className={`${styles.filterButton} ${selectedCategory === cat.slug ? styles.active : ''
                                                }`}
                                            onClick={() => setSelectedCategory(cat.slug)}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <h3>Sort By</h3>
                                <select
                                    className={styles.sortSelect}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.helpBox}>
                                <h4>Need Help?</h4>
                                <p>Contact us for personalized recommendations!</p>
                                <Link href="/contact">
                                    <Button variant="outline" size="sm" fullWidth>
                                        Get in Touch
                                    </Button>
                                </Link>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <main className={styles.productsContainer}>
                            <div className={styles.productsHeader}>
                                <p>
                                    Showing <strong>{sortedProducts.length}</strong> products
                                </p>
                            </div>

                            <div className={styles.productsGrid}>
                                {sortedProducts.map((product) => (
                                    <Card key={product.id} className={styles.productCard} hoverable>
                                        <div className={styles.productImage}>{product.image}</div>
                                        {product.newArrival && (
                                            <span className={styles.badge}>New</span>
                                        )}
                                        <div className={styles.productInfo}>
                                            <h3>{product.name}</h3>
                                            <p className={styles.price}>{formatPrice(product.price)}</p>
                                            <Link href={`/product/${product.id}`}>
                                                <Button variant="primary" size="sm" fullWidth>
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {sortedProducts.length === 0 && (
                                <div className={styles.noProducts}>
                                    <p>No products found in this category.</p>
                                    <Button onClick={() => setSelectedCategory('all')}>
                                        View All Products
                                    </Button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
