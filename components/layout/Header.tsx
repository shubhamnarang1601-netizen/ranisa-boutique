'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import styles from './Header.module.css';

export default function Header() {
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.headerContent}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <h1>Ranisa</h1>
                        <span>Boutique</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={`${styles.nav} ${styles.desktopNav}`}>
                        <Link href="/" className={styles.navLink}>
                            Home
                        </Link>
                        <Link href="/shop" className={styles.navLink}>
                            Shop
                        </Link>
                        <Link href="/about" className={styles.navLink}>
                            About
                        </Link>
                        <Link href="/contact" className={styles.navLink}>
                            Contact
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className={styles.actions}>
                        <Link href="/cart" className={styles.cartButton}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 2L7 6H3L8 12H16L21 6H17L15 2H9Z" />
                                <path d="M6 18C6 19.1046 6.89543 20 8 20C9.10457 20 10 19.1046 10 18" />
                                <path d="M14 18C14 19.1046 14.8954 20 16 20C17.1046 20 18 19.1046 18 18" />
                            </svg>
                            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                        </Link>

                        <Link href="/login" className={styles.loginButton}>
                            Login
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className={styles.menuToggle}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className={styles.mobileNav}>
                    <Link href="/" className={styles.mobileNavLink}>
                        Home
                    </Link>
                    <Link href="/shop" className={styles.mobileNavLink}>
                        Shop
                    </Link>
                    <Link href="/about" className={styles.mobileNavLink}>
                        About
                    </Link>
                    <Link href="/contact" className={styles.mobileNavLink}>
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
}
