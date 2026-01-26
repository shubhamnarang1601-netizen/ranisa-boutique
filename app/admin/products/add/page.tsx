'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { addProduct } from '@/lib/firebase/firestore';
import { uploadMultipleImages } from '@/lib/firebase/storage';
import { CATEGORIES, SIZES, COLORS } from '@/lib/constants';
import styles from './add-product.module.css';

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        stock: '',
        featured: false,
        newArrival: true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setFormData({
            ...formData,
            [target.name]: value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        setImageFiles(files);

        // Create previews
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index: number) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create temporary product ID
            const tempId = Date.now().toString();

            // Upload images first
            let imageUrls: string[] = [];
            if (imageFiles.length > 0) {
                imageUrls = await uploadMultipleImages(imageFiles, tempId);
            }

            // Add product to Firestore
            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                discount: formData.discount ? Number(formData.discount) : 0,
                category: formData.category,
                stock: Number(formData.stock),
                images: imageUrls,
                sizes: SIZES,
                colors: COLORS.map((c) => c.name),
                featured: formData.featured,
                newArrival: formData.newArrival,
            };

            await addProduct(productData);

            setSuccessMessage('✅ Product added successfully!');

            // Reset form
            setTimeout(() => {
                router.push('/admin/products');
            }, 2000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to add product');
            } else {
                setError('Failed to add product');
            }
            setLoading(false);
        }
    };

    return (
        <div className={styles.addProduct}>
            <div className={styles.header}>
                <h1>Add New Product</h1>
                <p>Upload product images, set prices, and publish to your store</p>
            </div>

            {successMessage ? (
                <div className={styles.successBox}>
                    <div className={styles.successIcon}>✓</div>
                    <h3>{successMessage}</h3>
                    <p>Redirecting to products page...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorBox}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className={styles.section}>
                        <h3>Product Images</h3>
                        <div className={styles.imageUpload}>
                            <label htmlFor="images" className={styles.uploadBox}>
                                <span className={styles.uploadIcon}>📷</span>
                                <p>Click to upload images</p>
                                <p className={styles.uploadHint}>JPG, PNG (Max 5 images)</p>
                            </label>
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className={styles.fileInput}
                            />
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className={styles.previews}>
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className={styles.previewItem}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className={styles.removeBtn}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className={styles.section}>
                        <h3>Basic Information</h3>
                        <div className={styles.grid}>
                            <Input
                                label="Product Name"
                                name="name"
                                type="text"
                                placeholder="e.g., Silk Saree - Pink"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <div className={styles.selectWrapper}>
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className={styles.select}
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.textareaWrapper}>
                            <label>Description *</label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="Describe your product..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className={styles.textarea}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className={styles.section}>
                        <h3>Pricing & Stock</h3>
                        <div className={styles.grid}>
                            <Input
                                label="Price (₹)"
                                name="price"
                                type="number"
                                placeholder="2999"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Discount (%)"
                                name="discount"
                                type="number"
                                placeholder="10"
                                value={formData.discount}
                                onChange={handleChange}
                            />

                            <Input
                                label="Stock Quantity"
                                name="stock"
                                type="number"
                                placeholder="50"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className={styles.section}>
                        <h3>Options</h3>
                        <div className={styles.checkboxes}>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                <span>Featured Product</span>
                            </label>

                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="newArrival"
                                    checked={formData.newArrival}
                                    onChange={handleChange}
                                />
                                <span>New Arrival</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            {loading ? 'Publishing...' : 'Publish Product'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
