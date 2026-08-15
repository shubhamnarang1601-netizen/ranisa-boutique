// Mock data for Roshni Boutique clone. Images pulled from original CDN.
// This data is MOCKED and will later be served from the backend.

export const NAV_COLLECTIONS = [
  { title: 'New In', handle: 'new-in' },
  { title: 'Best Sellers', handle: 'best-sellers' },
  { title: 'Designer Sarees', handle: 'designer-sarees' },
  { title: 'Casual Wear', handle: 'casual-wear' },
  { title: 'Party Wear', handle: 'party-wear' },
  { title: 'Indo Western', handle: 'indo-western' },
  { title: 'Plus Size', handle: 'plus-size' },
  { title: 'Luxurio', handle: 'luxurio' },
  { title: 'Accessories', handle: 'womens-accessories' },
  { title: 'Sale', handle: 'sale' },
];

export const HERO_SLIDES = [
  {
    id: 'h1',
    image: 'https://roshniboutiques.com/cdn/shop/files/New_Collection_1.png?v=1783935580&width=2800',
    mobileImage: 'https://roshniboutiques.com/cdn/shop/files/www.roshniboutiques.com_adede403-e016-47b2-87f5-e1161704bd3f.png?v=1773037761&width=1200',
    link: '/collections/sale',
    heading: 'New Collection',
    sub: 'Festive Edit 2025',
  },
  {
    id: 'h2',
    image: 'https://roshniboutiques.com/cdn/shop/files/1_669592c1-2c5a-4ab2-bd4c-eb4f60fff7af.png?v=1768306314&width=2800',
    mobileImage: 'https://roshniboutiques.com/cdn/shop/files/2_ddbcca17-3173-424f-9617-f58495b0f153.png?v=1768306554&width=2800',
    link: '/collections/new-in',
    heading: 'Just Arrived',
    sub: 'Handcrafted Ethnic Wear',
  },
];

export const QUOTE = '“If you believe it can happen, just be committed to it, and it will surely happen” - Roshni Tulsian';

export const COLLECTION_TILES = [
  { title: 'Sale', handle: 'sale', image: 'https://roshniboutiques.com/cdn/shop/files/a.png?v=1740713222&width=1200' },
  { title: 'New In', handle: 'new-in', image: 'https://roshniboutiques.com/cdn/shop/files/3_877c4d8e-e5d9-4c43-9741-491b086210b4.png?v=1740713014&width=1200' },
  { title: 'Best Sellers', handle: 'best-sellers', image: 'https://roshniboutiques.com/cdn/shop/files/1_da77dbfe-afae-4585-bcf2-735f2fc23b64.png?v=1740713013&width=1200' },
  { title: 'Casual Wear', handle: 'casual-wear', image: 'https://roshniboutiques.com/cdn/shop/files/2_f35c16f5-afd0-49e7-9c8a-a9a59ec39150.png?v=1740713014&width=1200' },
  { title: 'Party Wear', handle: 'party-wear', image: 'https://roshniboutiques.com/cdn/shop/files/4_3b5033c5-7263-4784-b5dd-8b5b2ad53346.png?v=1740713013&width=1200' },
  { title: 'Indo Western', handle: 'indo-western', image: 'https://roshniboutiques.com/cdn/shop/files/5_7c95eefe-457c-4f8f-8a74-575f2337e0b8.png?v=1740713014&width=1200' },
];

export const CATEGORY_BANNERS = [
  {
    title: 'Casual Wear',
    handle: 'casual-wear',
    banner: 'https://roshniboutiques.com/cdn/shop/files/Roshni_Boutique_Website_Banners-01_61acab11-936b-4e20-aede-60d48197f0a9.webp?v=1707884943&width=1880',
    tiles: [
      { title: 'Kurtis', handle: 'casual-wear-kurtis', image: 'https://roshniboutiques.com/cdn/shop/files/3_cd891ec1-3d3e-4bcb-b065-d58a1f400ad4.png?v=1740711955&width=1080' },
      { title: 'Kurta Pant', handle: 'casual-wear-kurta-pant', image: 'https://roshniboutiques.com/cdn/shop/files/White_Black_Introduce_Yourself_Instagram_Post.png?v=1740712335&width=1080' },
      { title: 'Frocks', handle: 'casual-wear-frocks', image: 'https://roshniboutiques.com/cdn/shop/files/15_f5a7e18e-7885-4d7a-a993-13766ac1c6ab.png?v=1740711955&width=1080' },
      { title: 'Gown', handle: 'casual-wear-gown', image: 'https://roshniboutiques.com/cdn/shop/files/12_04045765-0c8c-450b-88bb-156668a73bdd.png?v=1740711955&width=1080' },
      { title: 'Aliya Set', handle: 'casual-wear-aliya-set', image: 'https://roshniboutiques.com/cdn/shop/files/13_b107b0d4-fa83-48b4-b786-61cde84902c2.png?v=1740336957&width=1080' },
      { title: 'Sharara Sets', handle: 'casual-wear-sharara-sets', image: 'https://roshniboutiques.com/cdn/shop/files/9_23e083d4-65df-4146-8f89-cf9804587eb5.png?v=1740711956&width=1080' },
      { title: 'Co-ord Sets', handle: 'casual-wear-co-ord-sets', image: 'https://roshniboutiques.com/cdn/shop/files/14_ae2c7d7b-606c-4620-bdb4-ef40ad6de9ea.png?v=1740711955&width=1080' },
      { title: 'Kaftan', handle: 'casual-wear-kaftan', image: 'https://roshniboutiques.com/cdn/shop/files/4_635c8e34-0980-44db-bd60-02a4c7621306.png?v=1740711955&width=1080' },
    ],
  },
  {
    title: 'Plus Size',
    handle: 'plus-size',
    banner: 'https://roshniboutiques.com/cdn/shop/files/Roshni_Boutique_Website_Banners-03_0a7e318a-1504-4205-952a-972592339366.webp?v=1707884957&width=1880',
    tiles: [
      { title: 'Gown', handle: 'plus-size-gown', image: 'https://roshniboutiques.com/cdn/shop/files/19_eeee402e-249b-4a88-bdea-d8ca01a19be7.png?v=1740711956&width=1080' },
      { title: 'Indo Western', handle: 'plus-size-indo-western', image: 'https://roshniboutiques.com/cdn/shop/files/20_fdf6faca-457e-4ced-8c3b-7ada32bbb072.png?v=1740711955&width=1080' },
      { title: 'Kurtis', handle: 'plus-size-kurtis', image: 'https://roshniboutiques.com/cdn/shop/files/21_d2d89211-50cf-4f2e-af41-e612048af1f4.png?v=1740711955&width=1080' },
    ],
  },
  {
    title: "Women's Accessories",
    handle: 'womens-accessories',
    banner: 'https://roshniboutiques.com/cdn/shop/files/Roshni_Boutique_Website_Banners-07_070a62f7-f43f-41d1-9a35-f5ee7cc6e198.webp?v=1707884980&width=1880',
    tiles: [
      { title: 'Earrings', handle: 'earrings', image: 'https://roshniboutiques.com/cdn/shop/files/22.png?v=1740336956&width=1080' },
      { title: 'Pants', handle: 'pants', image: 'https://roshniboutiques.com/cdn/shop/files/21.png?v=1740336956&width=1080' },
      { title: 'Dupattas', handle: 'dupattas', image: 'https://roshniboutiques.com/cdn/shop/files/23.png?v=1740336956&width=1080' },
      { title: 'Unstitched', handle: 'unstitched-material', image: 'https://roshniboutiques.com/cdn/shop/files/24.png?v=1740336956&width=1080' },
    ],
  },
];

export const INSTAGRAM_IMAGES = [
  'https://roshniboutiques.com/cdn/shop/files/1_2718779b-20e8-4a4e-a9de-83305db2f2ac.png?v=1740336392&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/6.png?v=1740336392&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/5.png?v=1740336392&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/13.png?v=1740336392&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/9.png?v=1740336391&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/3.png?v=1740336392&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/8.png?v=1740336392&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/7.png?v=1740336393&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/14.png?v=1740336393&width=1080',
  'https://roshniboutiques.com/cdn/shop/files/2_716d20b5-e091-437e-88a6-2e540fb8ea8e.png?v=1740336392&width=1080',
];

export const REVIEWS = [
  { name: 'Sudeepthi', image: 'https://roshniboutiques.com/cdn/shop/files/Sudeepthi.png?v=1739465485&width=922', text: 'I have been a customer of Roshni Boutique for years, and they never fail to impress me with their beautiful collection. Their designs are always elegant, trendy, and of the highest quality.' },
  { name: 'Anusha Elluri', image: 'https://roshniboutiques.com/cdn/shop/files/Screenshot_2025-02-13_220443.png?v=1739465485&width=751', text: 'Quality of materials is so nice with unique designs and patterns. Loved the colors. They have casual and functional wear that are perfect. Sarees are available too and plus size outfits.' },
  { name: 'Swati Agarwal', image: 'https://roshniboutiques.com/cdn/shop/files/swati_agarwal.png?v=1739466068&width=556', text: "I'm a Roshni Boutique member for the last 4 years. It's a really trustworthy shop for offline and online too. The dresses are price worthy and the quality is top notch." },
  { name: 'Sarah Koshy Johnson', image: 'https://roshniboutiques.com/cdn/shop/files/Sarah_koshy_Johnson.png?v=1739466069&width=822', text: 'I have been an extremely happy customer at Roshni Boutique for the past four years and a regular buyer. I feel tremendously elated purchasing every single time.' },
  { name: 'Sandhya Kamath', image: 'https://roshniboutiques.com/cdn/shop/files/Screenshot_2025-02-13_223649.png?v=1739466451&width=422', text: 'Decent pricing. Good collection. You get all types of dresses (party wear, kurtis) in several fabrics (cottons, silks). Must try store.' },
  { name: 'Saroj Jassal', image: 'https://roshniboutiques.com/cdn/shop/files/Screenshot_2025-02-13_223704.png?v=1739466452&width=392', text: 'Absolutely beautiful outfits. Mine arrived today and I love love love. Will definitely be ordering more. Thank you Roshni!' },
];

export const FEATURES = [
  { title: '100% WOMEN OWNED', text: 'We believe in Empowering Women. Roshni Boutique is very proud to be a 100% women-owned enterprise.' },
  { title: 'PRIORITY CUSTOMER SERVICE', text: 'Experience personalized care with our priority customer support for a seamless shopping journey.' },
  { title: 'PAN INDIA DELIVERY', text: 'Enjoy our unique and elegant designs anywhere in India with our reliable PAN India delivery service.' },
  { title: 'SECURE PAYMENTS', text: 'Shop confidently at Roshni Boutique with our commitment to a secure and trustworthy shopping environment.' },
];

const img = (u) => u;

export const PRODUCTS = [
  {
    id: '15396', slug: 'glaze-cotton-western-style-frock-15396',
    title: 'Glaze Cotton Western Style Classy Look Floral Cut-Work Chain Accent Frock - 15396',
    price: 3195, compareAt: 3995, collections: ['new-in', 'casual-wear', 'best-sellers'],
    colors: ['Black', 'Brown'], sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Glaze Cotton', description: 'A classy western-style frock in premium glaze cotton featuring delicate floral cut-work and a stunning chain accent at the yoke. Perfect for casual outings and day events.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T122503.170.png?v=1785912951&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T122515.975.png?v=1785912951&width=1420')],
  },
  {
    id: '15645', slug: 'floral-applique-cut-work-mul-chanderi-frock-15645',
    title: 'Floral Applique Cut-Work Stylish Collar Mul-Chanderi Frock - 15645',
    price: 3195, compareAt: 3895, collections: ['new-in', 'casual-wear'],
    colors: ['Sea Blue', 'Blue', 'Brown'], sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Mul-Chanderi', description: 'An elegant ankle-length frock crafted in breathable Mul-Chanderi with floral applique cut-work and a stylish collar. Slightly lean fit for a graceful silhouette.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T123015.185.png?v=1785913253&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T123039.982.png?v=1785913253&width=1420')],
  },
  {
    id: '15466', slug: 'bushy-leaf-petals-embroidered-mul-chanderi-frock-15466',
    title: 'Bushy Leaf Petals Embroidered Mul-Chanderi Ankle Length Frock - 15466',
    price: 2095, compareAt: 2595, collections: ['new-in', 'casual-wear', 'best-sellers'],
    colors: ['Creamish Pink'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Mul-Chanderi', description: 'Delicate bushy leaf petal embroidery adorns this ankle-length Mul-Chanderi frock, offering an effortlessly graceful look for festive and casual days alike.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T124710.972.png?v=1785914294&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T124658.947.png?v=1785914294&width=1420')],
  },
  {
    id: '15421', slug: 'mandarin-collar-mul-chanderi-frock-3d-floral-applique-15421',
    title: 'Mandarin Collar Ankle Length Mul-Chanderi Frock with 3D Floral Applique Yoke - 15421',
    price: 1995, compareAt: 2495, collections: ['new-in', 'casual-wear'],
    colors: ['Onion Pink'], sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Mul-Chanderi', description: 'A refined Mandarin collar frock with a striking 3D floral applique yoke, tailored in soft Mul-Chanderi for all-day comfort and elegance.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-13T173025.200.png?v=1783944100&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-13T173106.591.png?v=1783944099&width=1420')],
  },
  {
    id: '15754', slug: 'jewel-handwork-flared-kaftan-palazzo-crepe-15754',
    title: 'Jewel Handwork Over Yoke Stylish Flared Kaftan With Palazzo Bottom In Premium Crepe - 15754',
    price: 10495, compareAt: 12995, collections: ['luxurio', 'party-wear', 'indo-western'],
    colors: ['Blue', 'Bottle Green'], sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Premium Crepe', description: 'A statement flared kaftan featuring intricate jewel handwork over the yoke, paired with flowing palazzo bottoms in premium crepe. Luxurio by Roshni.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-08-12T171149.063.png?v=1786534923&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/WhatsAppImage2026-08-12at12.28.18.jpg?v=1786518587&width=864')],
  },
  {
    id: '15584', slug: 'designer-neckpiece-mirror-shrug-crop-top-dhoti-skirt-15584',
    title: 'Designer Neckpiece Look Real Mirror Shrug Style Crop Top With Golden Prints Dhoti Skirt - 15584',
    price: 9595, compareAt: 11995, collections: ['luxurio', 'indo-western', 'party-wear'],
    colors: ['Light Peach', 'Brown'], sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Georgette', description: 'An indo-western showstopper: a shrug-style crop top with designer neckpiece look and real mirror detailing, paired with a wavy golden-print drape dhoti skirt.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_48_fe71cd17-46db-400c-9de2-b6cdeb60f8c9.png?v=1785235993&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_49_68834803-44ab-4400-ace8-2e1611113c7c.png?v=1785235992&width=1420')],
  },
  {
    id: '15011', slug: 'mango-buti-sequin-russian-silk-outer-harem-15011',
    title: 'Mango-Buti Fine Sequin Detailing Russian Silk Outer With Buster & Modal Satin Harem Bottom - 15011',
    price: 10795, compareAt: 13495, collections: ['luxurio', 'party-wear'],
    colors: ['Wine'], sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Russian Silk', description: 'Fine mango-buti sequin detailing on a Russian silk outer, styled with a buster and modal satin harem bottom for a regal celebration-ready look.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-17T192214.957.png?v=1784296502&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/WhatsApp_Image_2026-07-17_at_18.59.53_1.jpg?v=1784296501&width=576')],
  },
  {
    id: '14395', slug: 'mustard-bandhani-peplum-party-suit-mirror-work-14395',
    title: 'Mustard Yellow Bandhani Print Peplum Style Party Wear Full Suit Set with Mirror Work - 14395',
    price: 12495, compareAt: 14995, collections: ['luxurio', 'party-wear', 'best-sellers'],
    colors: ['Mustard Yellow'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Silk Blend', description: 'A vibrant mustard yellow Bandhani-print peplum suit set with delicate mirror work — a festive full set that radiates celebration.',
    images: [img('https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-09T125107.693.png?v=1783581758&width=1420'), img('https://roshniboutiques.com/cdn/shop/files/WhatsApp_Image_2026-07-09_at_11.59.05.jpg?v=1783581757&width=688')],
  },
];
