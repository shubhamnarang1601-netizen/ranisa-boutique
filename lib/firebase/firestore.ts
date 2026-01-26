// Firebase Firestore database operations

import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Product, Order, User, Category } from '@/lib/types';

// Products
export async function getAllProducts(): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return null;
    }

    return {
        ...productSnap.data(),
        id: productSnap.id,
        createdAt: productSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: productSnap.data().updatedAt?.toDate() || new Date(),
    } as Product;
}

export async function getProductsByCategory(
    category: string
): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', category));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('featured', '==', true), limit(8));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
}

export async function getNewArrivals(): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const q = query(
        productsRef,
        where('newArrival', '==', true),
        orderBy('createdAt', 'desc'),
        limit(8)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
}

export async function addProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateProduct(
    id: string,
    data: Partial<Product>
): Promise<void> {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteProduct(id: string): Promise<void> {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
}

// Orders
export async function createOrder(
    order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
        ...order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function getOrderById(id: string): Promise<Order | null> {
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
        return null;
    }

    return {
        ...orderSnap.data(),
        id: orderSnap.id,
        createdAt: orderSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: orderSnap.data().updatedAt?.toDate() || new Date(),
    } as Order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
    const ordersRef = collection(db, 'orders');
    const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
}

export async function getAllOrders(): Promise<Order[]> {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
}

export async function updateOrderStatus(
    id: string,
    status: Order['status']
): Promise<void> {
    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, {
        status,
        updatedAt: Timestamp.now(),
    });
}

// Categories
export async function getAllCategories(): Promise<Category[]> {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as Category[];
}

// Users
export async function getAllUsers(): Promise<User[]> {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt
            ? new Date(doc.data().createdAt)
            : new Date(),
    })) as User[];
}
