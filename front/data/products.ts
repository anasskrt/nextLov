import { Product } from '@/components/ProductCard';

export const products: Product[] = [
  {
    id: '1',
    name: 'Hydrating Face Serum',
    brand: 'GlowRx',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'skincare',
    isNew: true,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Matte Finish Foundation',
    brand: 'CoverWell',
    price: 32.00,
    originalPrice: 42.00,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1015&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'makeup',
    isSale: true,
    rating: 4
  },
  {
    id: '3',
    name: 'Repair & Shine Hair Mask',
    brand: 'TressLuxe',
    price: 28.50,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'hair',
    rating: 4.5
  },
  {
    id: '4',
    name: 'Coconut Body Scrub',
    brand: 'PureSpa',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'bath-body',
    rating: 5
  },
  {
    id: '5',
    name: 'Rose & Vanilla Eau de Parfum',
    brand: 'ScentMuse',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=980&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'fragrance',
    rating: 4
  },
  {
    id: '6',
    name: 'Vitamin C Brightening Serum',
    brand: 'GlowRx',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1608248527899-ff762ede42cf?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'skincare',
    rating: 4.5
  },
  {
    id: '7',
    name: 'Long-Wear Lipstick Collection',
    brand: 'CoverWell',
    price: 36.00,
    originalPrice: 48.00,
    image: 'https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'makeup',
    isSale: true,
    rating: 3.5
  },
  {
    id: '8',
    name: 'Volume Boost Shampoo',
    brand: 'TressLuxe',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1626784215021-2f47d92dbee7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'hair',
    rating: 4
  }
];

export const featuredProducts = products.slice(0, 4);

export const newArrivals = products.filter(product => product.isNew);

export const onSale = products.filter(product => product.isSale);

export const categoryList = [
  {
    id: 'skincare',
    name: 'Skincare',
    image: 'https://images.unsplash.com/photo-1570554520913-ce2e57df2366?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Cleansers, serums, moisturizers and more'
  },
  {
    id: 'makeup',
    name: 'Makeup',
    image: 'https://images.unsplash.com/photo-1522335579687-9c718c5184d6?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Foundations, lipsticks, eyeshadows and more'
  },
  {
    id: 'hair',
    name: 'Hair',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=972&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Shampoos, conditioners, treatments and more'
  },
  {
    id: 'bath-body',
    name: 'Bath & Body',
    image: 'https://images.unsplash.com/photo-1523368758202-87238337ea22?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Soaps, scrubs, lotions and more'
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    image: 'https://images.unsplash.com/photo-1566977776052-050ee2c36f2c?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Perfumes, colognes, body mists and more'
  }
];