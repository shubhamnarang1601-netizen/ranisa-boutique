'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import styles from './contact.module.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>We&apos;d love to hear from you! Reach out with any questions or inquiries.</p>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className={styles.contact}>
                <div className="container">
                    <div className={styles.contactGrid}>
                        {/* Contact Info Cards */}
                        <div className={styles.infoSection}>
                            <Card className={styles.infoCard}>
                                <div className={styles.infoIcon}>📍</div>
                                <h3>Visit Our Store</h3>
                                <p>Fashion Street, Andheri West</p>
                                <p>Mumbai, Maharashtra 400058</p>
                                <p>India</p>
                            </Card>

                            <Card className={styles.infoCard}>
                                <div className={styles.infoIcon}>📞</div>
                                <h3>Call Us</h3>
                                <p>
                                    <strong>Phone:</strong> +91 98765 43210
                                </p>
                                <p>
                                    <strong>WhatsApp:</strong> +91 98765 43210
                                </p>
                                <p className={styles.hours}>Mon-Sat: 10:00 AM - 8:00 PM</p>
                            </Card>

                            <Card className={styles.infoCard}>
                                <div className={styles.infoIcon}>📧</div>
                                <h3>Email Us</h3>
                                <p>
                                    <strong>General:</strong> info@ranisaboutique.com
                                </p>
                                <p>
                                    <strong>Support:</strong> support@ranisaboutique.com
                                </p>
                                <p>
                                    <strong>Orders:</strong> orders@ranisaboutique.com
                                </p>
                            </Card>

                            <Card className={styles.infoCard}>
                                <div className={styles.infoIcon}>💬</div>
                                <h3>Social Media</h3>
                                <div className={styles.social}>
                                    <a href="#" className={styles.socialLink}>
                                        Facebook
                                    </a>
                                    <a href="#" className={styles.socialLink}>
                                        Instagram
                                    </a>
                                    <a href="#" className={styles.socialLink}>
                                        Pinterest
                                    </a>
                                    <a href="#" className={styles.socialLink}>
                                        WhatsApp
                                    </a>
                                </div>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className={styles.formSection}>
                            <Card className={styles.formCard}>
                                <h2>Send Us a Message</h2>
                                <p className={styles.formSubtitle}>
                                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                                </p>

                                {submitted ? (
                                    <div className={styles.successMessage}>
                                        <div className={styles.successIcon}>✓</div>
                                        <h3>Thank you for contacting us!</h3>
                                        <p>We&apos;ve received your message and will respond shortly.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className={styles.form}>
                                        <Input
                                            label="Full Name"
                                            name="name"
                                            type="text"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />

                                        <Input
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />

                                        <Input
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />

                                        <Input
                                            label="Subject"
                                            name="subject"
                                            type="text"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />

                                        <div className={styles.textareaWrapper}>
                                            <label htmlFor="message">
                                                Message <span className={styles.required}>*</span>
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={6}
                                                placeholder="Tell us more about your inquiry..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                className={styles.textarea}
                                            />
                                        </div>

                                        <Button type="submit" variant="primary" size="lg" fullWidth>
                                            Send Message
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles.faq}>
                <div className="container">
                    <h2 className="text-center mb-6">Frequently Asked Questions</h2>
                    <div className={styles.faqGrid}>
                        <div className={styles.faqItem}>
                            <h3>🚚 Do you offer free shipping?</h3>
                            <p>Yes! We offer free shipping on all orders above ₹1,500.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>↩️ What&apos;s your return policy?</h3>
                            <p>We offer a 7-day hassle-free return policy on all products.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>⏰ What are your store hours?</h3>
                            <p>We&apos;re open Monday to Saturday, 10:00 AM to 8:00 PM.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>💳 What payment methods do you accept?</h3>
                            <p>We accept Cash on Delivery, UPI, Cards, and Razorpay.</p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
