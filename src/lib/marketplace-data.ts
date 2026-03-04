export type MarketplaceProduct = {
  id: string
  name: string
  description: string
  price: number
  category: 'Art' | 'Fashion' | 'Wellness' | 'Home' | 'Food'
  impact: 'cultural' | 'community' | 'wellbeing' | 'economic'
  imageUrl: string
  inStock: boolean
  vendorId: string
  vendorName: string
}

export type MarketplaceOrder = {
  id: string
  total: number
  status: 'pending' | 'completed'
  createdAt: string
  items: number
}

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: 'p1',
    name: 'Hand-Painted Story Canvas',
    description: 'Acrylic-on-canvas artwork created by community artists with story notes from the workshop circle.',
    price: 185,
    category: 'Art',
    impact: 'cultural',
    imageUrl: '/images/community-gathering.jpg',
    inStock: true,
    vendorId: 'v1',
    vendorName: 'Mudyin Art Collective',
  },
  {
    id: 'p2',
    name: 'Bush Wellness Tea Set',
    description: 'Locally blended tea selection with cultural plant knowledge guidance and brewing card.',
    price: 42,
    category: 'Wellness',
    impact: 'wellbeing',
    imageUrl: '/images/healing-services.jpg',
    inStock: true,
    vendorId: 'v2',
    vendorName: 'Healing Centre Store',
  },
  {
    id: 'p3',
    name: 'Program Hoodie - YSMP',
    description: 'Heavyweight fleece hoodie for early morning sessions. Includes YSMP emblem embroidery.',
    price: 95,
    category: 'Fashion',
    impact: 'community',
    imageUrl: '/images/ysmp-fitness.jpg',
    inStock: true,
    vendorId: 'v3',
    vendorName: 'Youth Makers Hub',
  },
  {
    id: 'p4',
    name: 'Native Spice Cooking Pack',
    description: 'Pantry bundle curated for family meals and cultural cooking sessions.',
    price: 36,
    category: 'Food',
    impact: 'economic',
    imageUrl: '/images/culture-country.jpg',
    inStock: true,
    vendorId: 'v2',
    vendorName: 'Healing Centre Store',
  },
  {
    id: 'p5',
    name: 'Woven Gathering Basket',
    description: 'Handmade woven basket crafted in weekly community weaving circles.',
    price: 78,
    category: 'Home',
    impact: 'cultural',
    imageUrl: '/images/thrive-tribe.jpg',
    inStock: false,
    vendorId: 'v1',
    vendorName: 'Mudyin Art Collective',
  },
]

export const marketplaceOrders: MarketplaceOrder[] = [
  {
    id: 'ORD-1048',
    total: 137,
    status: 'completed',
    createdAt: '2026-02-25',
    items: 2,
  },
  {
    id: 'ORD-1052',
    total: 95,
    status: 'pending',
    createdAt: '2026-03-01',
    items: 1,
  },
]
