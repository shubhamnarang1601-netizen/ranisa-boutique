// Firebase Storage utilities for image uploads

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll,
} from 'firebase/storage';
import { storage } from './config';

export async function uploadProductImage(
    file: File,
    productId: string
): Promise<string> {
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `products/${productId}/${fileName}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to upload image: ${message}`);
    }
}

export async function uploadMultipleImages(
    files: File[],
    productId: string
): Promise<string[]> {
    const uploadPromises = files.map((file) =>
        uploadProductImage(file, productId)
    );
    return Promise.all(uploadPromises);
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to delete image: ${message}`);
    }
}

export async function deleteAllProductImages(productId: string): Promise<void> {
    try {
        const folderRef = ref(storage, `products/${productId}`);
        const listResult = await listAll(folderRef);

        const deletePromises = listResult.items.map((itemRef) =>
            deleteObject(itemRef)
        );
        await Promise.all(deletePromises);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to delete product images: ${message}`);
    }
}

export async function uploadCategoryImage(file: File): Promise<string> {
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `categories/${fileName}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to upload category image: ${message}`);
    }
}
