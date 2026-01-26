// Application constants

export const CATEGORIES = [
    { id: '1', name: 'Sarees', slug: 'sarees' },
    { id: '2', name: 'Salwar Suits', slug: 'salwar-suits' },
    { id: '3', name: 'Lehengas', slug: 'lehengas' },
    { id: '4', name: 'Kurtis', slug: 'kurtis' },
    { id: '5', name: 'Gowns', slug: 'gowns' },
    { id: '6', name: 'Accessories', slug: 'accessories' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const COLORS = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
];

export const SHIPPING_RATES = {
    standard: 50,
    express: 150,
    free: 0,
    freeThreshold: 1500, // Free shipping above ₹1500
};

export const ORDER_STATUS = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export const PAYMENT_METHODS = [
    { id: 'cod', name: 'Cash on Delivery' },
    { id: 'upi', name: 'UPI Payment' },
    { id: 'card', name: 'Debit/Credit Card' },
    { id: 'razorpay', name: 'Razorpay' },
];

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
];
