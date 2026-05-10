'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Store, X, ArrowRight, Sparkles } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { marketplaceProducts, type MarketplaceProduct } from '@/lib/marketplace-data'

type CartItem = {
  productId: string
  quantity: number
  product: MarketplaceProduct
}

const trailCollections = [
  {
    id: 'cultural',
    title: 'Cultural Continuity',
    story: 'From weaving circles to shared homes, each item carries practice forward.',
    image: '/images/culture-country.jpg',
  },
  {
    id: 'community',
    title: 'Community Strength',
    story: 'Products seed group participation, mentoring, and practical support.',
    image: '/images/community-gathering.jpg',
  },
  {
    id: 'wellbeing',
    title: 'Wellbeing Access',
    story: 'Purchases sustain transport, sessions, and local healing pathways.',
    image: '/images/healing-services.jpg',
  },
]

const pathwayNarratives = [
  {
    id: 'p1',
    title: 'Program Funding Pathways',
    text: 'Purchases feed directly into participation support, transport, and session access.',
  },
  {
    id: 'p2',
    title: 'Community Outcomes',
    text: 'Revenue supports collective outcomes: retention, wellbeing, and intergenerational continuity.',
  },
  {
    id: 'p3',
    title: 'Maker Stories',
    text: 'Each collection is linked to people, circles, and practical local change.',
  },
]

const impactThemes = [
  { id: 'all', label: 'All Impact Themes' },
  { id: 'cultural', label: 'Cultural Continuity' },
  { id: 'community', label: 'Community Strength' },
  { id: 'wellbeing', label: 'Wellbeing Access' },
  { id: 'economic', label: 'Economic Pathways' },
]

const categories = [
  'all',
  ...Array.from(new Set(marketplaceProducts.map((product) => product.category))),
]

export default function MarketplacePage() {
  const [category, setCategory] = useState('all')
  const [impactTheme, setImpactTheme] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [sellForm, setSellForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  })

  const filteredProducts = useMemo(() => {
    return marketplaceProducts.filter((product) => {
      const categoryMatch = category === 'all' || product.category === category
      const impactMatch = impactTheme === 'all' || product.impact === impactTheme
      return categoryMatch && impactMatch
    })
  }, [category, impactTheme])

  const addToCart = (product: MarketplaceProduct) => {
    const existing = cart.find((item) => item.productId === product.id)
    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
      return
    }
    setCart([...cart, { productId: product.id, quantity: 1, product }])
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.productId !== productId))
      return
    }
    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Marketplace"
        subtitle="Story first, impact always"
        description="Browse community-made goods through story trails and impact collections. Commerce follows culture here."
        image="/images/community-gathering.jpg"
        imageAlt="Community makers and stories driving marketplace impact"
        breadcrumbs={[{ label: 'Marketplace' }]}
      />

      <section className="section-spacing section-padding">
        <div className="container-wide">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Story Trail Entry
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {trailCollections.map((trail) => (
                <button
                  key={trail.id}
                  onClick={() => setImpactTheme(trail.id)}
                  className="text-left rounded-2xl overflow-hidden group relative min-h-[210px] healing-border"
                >
                  <Image
                    src={trail.image}
                    alt={trail.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 52%, rgba(200,167,93,0.08) 0 12%, rgba(184,117,85,0.09) 24%, transparent 44%), linear-gradient(180deg, rgba(2,2,2,0.48) 0 56%, rgba(184,117,85,0.12) 100%)',
                    }}
                  />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.64)' }}>
                      Collection Ceremony
                    </p>
                    <h3 className="font-display text-3xl mb-2 leading-none">{trail.title}</h3>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.82)' }}>{trail.story}</p>
                    <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Follow this trail <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-4 mb-8">
            <div className="lg:col-span-7 rounded-2xl p-8 healing-panel healing-border">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Community Commerce
              </p>
              <h2 className="font-display text-3xl font-semibold mb-2">
                Story before product. Impact before checkout.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.68)' }}>
                This marketplace is a browsing experience for belonging and systems change.
                Program funding pathways, community outcomes, and maker stories remain at the front.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {impactThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setImpactTheme(theme.id)}
                    className="healing-chip"
                    style={impactTheme === theme.id ? { opacity: 1 } : { opacity: 0.82 }}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              {pathwayNarratives.map((card) => (
                <article key={card.id} className="rounded-2xl p-4 healing-panel healing-border">
                  <p className="text-xs uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(255,255,255,0.56)' }}>
                    Header Narrative
                  </p>
                  <h3 className="font-display text-xl">{card.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className="healing-chip"
                  style={category === item ? { opacity: 1 } : { opacity: 0.78 }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSellModal(true)}
                className="btn-outline text-sm inline-flex items-center gap-2"
              >
                <Plus size={14} /> Sell Product
              </button>
              <button
                onClick={() => setShowCart((prev) => !prev)}
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <ShoppingCart size={14} /> Cart ({cart.length})
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    className="rounded-2xl overflow-hidden group healing-panel healing-border"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={640}
                      height={352}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.42)' }}>
                        {product.vendorName}
                      </p>
                      <h3 className="font-display text-xl mb-2">{product.name}</h3>
                      <p className="text-sm mb-3 min-h-[60px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
                        {product.description}
                      </p>
                      <div className="mb-4 rounded-lg p-2.5 healing-border" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(255,255,255,0.48)' }}>
                          Impact Outcome
                        </p>
                        <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.78)' }}>
                          <Sparkles size={13} />
                          Supports {product.impact} initiatives
                        </p>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-display" style={{ color: 'var(--color-ochre-400)' }}>
                          ${product.price}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={
                            product.inStock
                              ? { backgroundColor: 'rgba(157,193,131,0.2)', color: 'var(--color-sage-400)' }
                              : { backgroundColor: 'rgba(239,68,68,0.16)', color: '#fca5a5' }
                          }
                        >
                          {product.inStock ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Link href={`/marketplace/vendor/${product.vendorId}`} className="btn-ghost text-xs">
                          View Vendor
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="btn-primary text-xs flex-1 disabled:opacity-50 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0 transition-all duration-200"
                        >
                          {product.inStock ? 'Add to Cart' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="card-dark rounded-2xl p-8 text-center healing-border">
                  <Store className="mx-auto mb-3" style={{ color: 'var(--color-ochre-400)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.62)' }}>
                    No products in this collection yet.
                  </p>
                </div>
              )}
            </div>

            {showCart && (
              <aside className="card-dark rounded-2xl p-5 h-fit healing-border">
                <h3 className="font-display text-xl mb-4">Your Cart</h3>
                {cart.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.62)' }}>Your cart is empty.</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-5">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            sizes="48px"
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{item.product.name}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                              ${item.product.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded bg-white/10">
                              -
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded bg-white/10">
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4" style={{ borderTop: '1px solid rgba(65,70,72,0.5)' }}>
                      <div className="flex justify-between mb-4">
                        <span>Total</span>
                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                      </div>
                      <button className="btn-primary w-full text-sm">
                        Checkout (Demo)
                      </button>
                    </div>
                  </>
                )}
              </aside>
            )}
          </div>
        </div>
      </section>

      {showSellModal && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-xl rounded-2xl p-6 healing-panel healing-border">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-2xl">Sell a Product</h3>
              <button onClick={() => setShowSellModal(false)} className="btn-ghost p-2">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={sellForm.name}
                onChange={(e) => setSellForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Product name"
                className="input-dark"
              />
              <textarea
                rows={4}
                value={sellForm.description}
                onChange={(e) => setSellForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                className="input-dark resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={sellForm.price}
                  onChange={(e) => setSellForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Price"
                  className="input-dark"
                />
                <input
                  type="text"
                  value={sellForm.category}
                  onChange={(e) => setSellForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Category"
                  className="input-dark"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSellModal(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
                <button onClick={() => setShowSellModal(false)} className="btn-primary text-sm">
                  Save Draft (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
