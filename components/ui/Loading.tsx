import React from 'react';
import styles from './Loading.module.css';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    return (
        <div className={`${styles.spinner} ${styles[size]}`}>
            <div className={styles.spinnerRing}></div>
        </div>
    );
}

export function LoadingDots() {
    return (
        <div className={styles.dots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
}

export function LoadingSkeleton({
    width = '100%',
    height = '20px',
    className = '',
}: {
    width?: string;
    height?: string;
    className?: string;
}) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width, height }}
        />
    );
}

export function PageLoading() {
    return (
        <div className={styles.pageLoading}>
            <LoadingSpinner size="lg" />
            <p className={styles.loadingText}>Loading...</p>
        </div>
    );
}

export default function Loading() {
    return <LoadingSpinner />;
}
