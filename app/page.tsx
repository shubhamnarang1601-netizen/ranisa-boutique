import React from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const categories = [
    { name: 'Sarees', slug: 'sarees', emoji: '🥻' },
    { name: 'Salwar Suits', slug: 'salwar-suits', emoji: '👘' },
    { name: 'Lehengas', slug: 'lehengas', emoji: '👗' },
    { name: 'Kurtis', slug: 'kurtis', emoji: '👚' },
    { name: 'Gowns', slug: 'gowns', emoji: '💃' },
    { name: 'Accessories', slug: 'accessories', emoji: '💍' },
  ];

  const features = [
    {
      icon: '✨',
      title: 'Premium Quality',
      description: 'Handpicked fabrics and exquisite craftsmanship',
    },
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'On orders above ₹1,500',
    },
    {
      icon: '↩️',
      title: 'Easy Returns',
      description: '7-day hassle-free return policy',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Multiple payment options available',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Discover Timeless
              <span className={styles.gradient}> Elegance</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Exquisite collection of ethnic wear and premium fashion. Celebrate
              your unique style with Ranisa Boutique.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className={styles.primaryButton}>
                Shop Collection
              </Link>
              <Link href="/about" className={styles.secondaryButton}>
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryIcon}>{category.emoji}</div>
                <h3>{category.name}</h3>
                <p>Explore Collection →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to Transform Your Wardrobe?</h2>
            <p>
              Join thousands of satisfied customers who trust Ranisa Boutique for
              their ethnic wear needs.
            </p>
            <Link href="/shop" className={styles.ctaButton}>
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
