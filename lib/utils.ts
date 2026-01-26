// Utility functions

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
}

export function calculateDiscount(price: number, discount?: number): number {
    if (!discount) return price;
    return price - (price * discount) / 100;
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(d);
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePhone(phone: string): boolean {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/\s|-/g, ''));
}

export function generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}

export function getStockStatus(stock: number): {
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
    label: string;
} {
    if (stock <= 0) {
        return { status: 'out-of-stock', label: 'Out of Stock' };
    } else if (stock < 10) {
        return { status: 'low-stock', label: `Only ${stock} left` };
    }
    return { status: 'in-stock', label: 'In Stock' };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
