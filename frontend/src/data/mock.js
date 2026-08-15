// Static content for Ranisa Boutique storefront.
// Products are served from the backend API (MongoDB). Only presentational
// content (hero, tiles, gallery, reviews, features) lives here.

const P = '&w=900&q=80';
const H = '&w=1920&q=80';

export const LOGO_URL = 'https://customer-assets-jai6qajn.emergentagent.net/job_boutique-shop-admin/artifacts/9ctppelu_WhatsApp%20Image%202026-08-15%20at%202.30.11%20PM.jpeg';

export const NAV_COLLECTIONS = [
  { title: 'Casual Wear', handle: 'casual-wear' },
  { title: 'Party Wear', handle: 'party-wear' },
  { title: 'Ethnic Wear', handle: 'ethnic-wear' },
];

export const HERO_SLIDES = [
  {
    id: 'h1',
    image: 'https://customer-assets-jai6qajn.emergentagent.net/job_boutique-shop-admin/artifacts/wexk1cfj_image.png',
    link: '/collections/ethnic-wear',
    heading: 'The Festive Edit',
    sub: 'New Collection 2025',
  },
];

export const QUOTE = 'Where tradition meets elegance \u2014 crafted for the modern woman.';

export const COLLECTION_TILES = [
  { title: 'Casual Wear', handle: 'casual-wear', image: 'https://images.unsplash.com/photo-1745313452052-0e4e341f326c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxrdXJ0aXxlbnwwfHx8fDE3ODY3ODM0NDB8MA&ixlib=rb-4.1.0' + P },
  { title: 'Party Wear', handle: 'party-wear', image: 'https://images.unsplash.com/photo-1668371679302-a8ec781e876e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc4Njc4MzQyOXww&ixlib=rb-4.1.0' + P },
  { title: 'Ethnic Wear', handle: 'ethnic-wear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwzfHxzYXJlZSUyMHdvbWFufGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P },
];

export const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1597983073750-16f5ded1321f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHw0fHxrdXJ0aXxlbnwwfHx8fDE3ODY3ODM0NDB8MA&ixlib=rb-4.1.0' + P,
  'https://images.unsplash.com/photo-1739429942851-9083ee185d3d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHw0fHxzYXJlZSUyMHdvbWFufGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P,
  'https://images.unsplash.com/photo-1668371459824-094a960a227d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc4Njc4MzQyOXww&ixlib=rb-4.1.0' + P,
  'https://images.unsplash.com/photo-1745313452052-0e4e341f326c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxrdXJ0aXxlbnwwfHx8fDE3ODY3ODM0NDB8MA&ixlib=rb-4.1.0' + P,
  'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc4Njc4MzQyOXww&ixlib=rb-4.1.0' + P,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwzfHxzYXJlZSUyMHdvbWFufGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P,
  'https://images.unsplash.com/photo-1746372283841-dbb3838f9935?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhfGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P,
  'https://images.unsplash.com/photo-1767955694884-d4bf352c23c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHw0fHxsZWhlbmdhfGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P,
];

export const REVIEWS = [
  { name: 'Sudeepthi', text: "I have been a customer of Ranisa Boutique for years, and they never fail to impress me with their beautiful collection. Their designs are always elegant, trendy, and of the highest quality." },
  { name: 'Anusha Elluri', text: 'Quality of materials is so nice with unique designs and patterns. Loved the colors. They have casual and functional wear that are perfect. Sarees and plus size outfits are available too.' },
  { name: 'Swati Agarwal', text: "I've been a Ranisa Boutique member for years. It's a really trustworthy shop for offline and online. The dresses are price worthy and the quality is top notch." },
  { name: 'Sarah Koshy', text: 'I have been an extremely happy customer at Ranisa Boutique and a regular buyer. I feel tremendously elated purchasing every single time.' },
  { name: 'Sandhya Kamath', text: 'Decent pricing. Good collection. You get all types of dresses (party wear, kurtis) in several fabrics (cottons, silks). Must try store.' },
  { name: 'Saroj Jassal', text: 'Absolutely beautiful outfits. Mine arrived today and I love love love. Will definitely be ordering more. Thank you Ranisa!' },
];

export const FEATURES = [
  { title: '100% WOMEN OWNED', text: 'We believe in empowering women. Ranisa Boutique is proud to be a 100% women-owned enterprise.' },
  { title: 'PRIORITY CUSTOMER SERVICE', text: 'Experience personalized care with our priority customer support for a seamless shopping journey.' },
  { title: 'PAN INDIA DELIVERY', text: 'Enjoy our unique and elegant designs anywhere in India with reliable PAN India delivery.' },
  { title: 'SECURE PAYMENTS', text: 'Shop confidently at Ranisa Boutique with our commitment to a secure and trustworthy environment.' },
];
