import React from 'react';
import Layout from '@/components/layout/Layout';
import styles from './about.module.css';

export default function AboutPage() {
    return (
        <Layout>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>About Ranisa Boutique</h1>
                    <p className={styles.subtitle}>
                        Where tradition meets contemporary elegance
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className={styles.story}>
                <div className="container">
                    <div className={styles.storyGrid}>
                        <div className={styles.storyImage}>
                            <div className={styles.placeholder}>🎨</div>
                        </div>
                        <div className={styles.storyContent}>
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2015, Ranisa Boutique began with a simple vision: to
                                bring the finest ethnic wear to fashion-conscious women who
                                appreciate quality and craftsmanship.
                            </p>
                            <p>
                                What started as a small boutique in Mumbai has grown into a
                                trusted name for premium sarees, salwar suits, lehengas, and
                                ethnic wear across India.
                            </p>
                            <p>
                                Every piece in our collection is carefully curated, ensuring that
                                you get nothing but the best in terms of fabric quality, design,
                                and craftsmanship.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.values}>
                <div className="container">
                    <h2 className="text-center mb-8">Our Values</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>✨</div>
                            <h3>Quality First</h3>
                            <p>
                                We never compromise on quality. Every product is inspected to
                                meet our high standards.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>🤝</div>
                            <h3>Customer Trust</h3>
                            <p>
                                Your satisfaction is our priority. We build lasting relationships
                                with our customers.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>🎨</div>
                            <h3>Authentic Designs</h3>
                            <p>
                                We celebrate traditional craftsmanship while embracing modern
                                design sensibilities.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>💎</div>
                            <h3>Premium Selection</h3>
                            <p>
                                Handpicked collections that reflect elegance, style, and timeless
                                beauty.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className={styles.mission}>
                <div className="container">
                    <div className={styles.missionContent}>
                        <h2>Our Mission</h2>
                        <p>
                            To empower women to celebrate their unique style and heritage
                            through exquisite ethnic wear that combines traditional artistry
                            with contemporary fashion.
                        </p>
                        <p>
                            We believe that every woman deserves to feel confident, beautiful,
                            and special. That&apos;s why we&apos;re committed to offering:
                        </p>
                        <ul>
                            <li>✓ Premium quality fabrics and materials</li>
                            <li>✓ Authentic handcrafted designs</li>
                            <li>✓ Affordable luxury for every occasion</li>
                            <li>✓ Exceptional customer service</li>
                            <li>✓ Sustainable and ethical practices</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>10+</h3>
                            <p>Years of Excellence</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>50K+</h3>
                            <p>Happy Customers</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>1000+</h3>
                            <p>Unique Designs</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>5★</h3>
                            <p>Customer Rating</p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
