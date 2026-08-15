// Static content for Ranisa Boutique storefront.
// Products are served from the backend API (MongoDB). Only presentational
// content (hero, tiles, gallery, reviews, features) lives here.

const P = '&w=900&q=80';
const H = '&w=1920&q=80';

export const NAV_COLLECTIONS = [
  { title: 'New In', handle: 'new-in' },
  { title: 'Best Sellers', handle: 'best-sellers' },
  { title: 'Designer Sarees', handle: 'designer-sarees' },
  { title: 'Casual Wear', handle: 'casual-wear' },
  { title: 'Party Wear', handle: 'party-wear' },
  { title: 'Indo Western', handle: 'indo-western' },
  { title: 'Plus Size', handle: 'plus-size' },
  { title: 'Accessories', handle: 'womens-accessories' },
  { title: 'Sale', handle: 'sale' },
];

export const HERO_SLIDES = [
  {
    id: 'h1',
    image: 'https://images.unsplash.com/photo-1610030468706-9a6dbad49b0a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxzYXJlZSUyMGZhc2hpb258ZW58MHx8fHwxNzg2NzgzNDk2fDA&ixlib=rb-4.1.0' + H,
    link: '/collections/new-in',
    heading: 'The Festive Edit',
    sub: 'New Collection 2025',
  },
  {
    id: 'h2',
    image: 'https://images.unsplash.com/photo-1739429942851-9083ee185d3d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjB3b21hbiUyMHNhcmVlfGVufDB8fHx8MTc4Njc4MzUwNHww&ixlib=rb-4.1.0' + H,
    link: '/collections/party-wear',
    heading: 'Grace in Every Drape',
    sub: 'Handpicked Ethnic Wear',
  },
];

export const QUOTE = 'Where tradition meets elegance \u2014 crafted for the modern woman.';

export const COLLECTION_TILES = [
  { title: 'New In', handle: 'new-in', image: 'https://images.unsplash.com/photo-1767955694884-d4bf352c23c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHw0fHxsZWhlbmdhfGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P },
  { title: 'Party Wear', handle: 'party-wear', image: 'https://images.unsplash.com/photo-1668371679302-a8ec781e876e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc4Njc4MzQyOXww&ixlib=rb-4.1.0' + P },
  { title: 'Designer Sarees', handle: 'designer-sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwzfHxzYXJlZSUyMHdvbWFufGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P },
  { title: 'Casual Wear', handle: 'casual-wear', image: 'https://images.unsplash.com/photo-1745313452052-0e4e341f326c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxrdXJ0aXxlbnwwfHx8fDE3ODY3ODM0NDB8MA&ixlib=rb-4.1.0' + P },
  { title: 'Indo Western', handle: 'indo-western', image: 'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc4Njc4MzQyOXww&ixlib=rb-4.1.0' + P },
  { title: 'Sale', handle: 'sale', image: 'https://images.unsplash.com/photo-1746372283841-dbb3838f9935?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhfGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P },
];

export const SHOP_BY_CATEGORY = [
  { title: 'Kurtis', handle: 'casual-wear', image: 'https://images.unsplash.com/photo-1708534419572-6e6614a53ca1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwzfHxrdXJ0aXxlbnwwfHx8fDE3ODY3ODM0NDB8MA&ixlib=rb-4.1.0' + P },
  { title: 'Sarees', handle: 'designer-sarees', image: 'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxzYXJlZSUyMHdvbWFufGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P },
  { title: 'Gowns', handle: 'party-wear', image: 'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxsZWhlbmdhfGVufDB8fHx8MTc4Njc4MzQzNXww&ixlib=rb-4.1.0' + P },
  { title: 'Anarkali', handle: 'party-wear', image: 'https://images.unsplash.com/photo-1668371459824-094a960a227d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc4Njc4MzQyOXww&ixlib=rb-4.1.0' + P },
  { title: 'Kurta Sets', handle: 'casual-wear', image: 'https://images.unsplash.com/photo-1741847639057-b51a25d42892?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxrdXJ0aXxlbnwwfHx8fDE3ODY3ODM0NDB8MA&ixlib=rb-4.1.0' + P },
  { title: 'Festive', handle: 'new-in', image: 'https://images.unsplash.com/photo-1503160865267-af4660ce7bf2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc4Njc4MzQyOXww&ixlib=rb-4.1.0' + P },
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
