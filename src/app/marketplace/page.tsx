'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Store, X } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { marketplaceProducts, type MarketplaceProduct } from '@/lib/marketplace-data'

type CartItem = {
  productId: string
  quantity: number
  product: MarketplaceProduct
}

const peopleStories = [
  {
    id: 's1',
    person: 'Aunty Marnie',
    role: 'Weaving Circle Mentor',
    narrative: 'Every basket sold helps fund two more young people to join our weekly weaving circle.',
    trail: 'Cultural Continuity',
  },
  {
    id: 's2',
    person: 'Jalen',
    role: 'YSMP Participant',
    narrative: 'The hoodie project taught me design, planning, and how to run a small community drop.',
    trail: 'Youth Leadership',
  },
  {
    id: 's3',
    person: 'Healing Team',
    role: 'Wellness Facilitators',
    narrative: 'Tea bundles support weekly healing sessions and transport for families attending workshops.',
    trail: 'Wellbeing Access',
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
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Marketplace"
        subtitle="Community-made goods"
        description="Discover products created by Mudyin participants and partners. Every purchase supports cultural programs and local community outcomes."
        breadcrumbs={[{ label: 'Marketplace' }]}
      />

      <section className="section-padding py-16">
        <div className="container-wide">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Story Trails
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {peopleStories.map((story) => (
                <article
                  key={story.id}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(195,121,32,0.36)',
                  }}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-flag-yellow)' }}>
                    {story.trail}
                  </p>
                  <h3 className="font-display text-xl mb-1">{story.person}</h3>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.56)' }}>
                    {story.role}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    {story.narrative}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mb-8 rounded-2xl p-6 blak-motif-organic" style={{ backgroundColor: 'rgba(2,2,2,0.75)', border: '1px solid rgba(243,222,44,0.25)' }}>
            <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.58)' }}>
              Collection Ceremonies
            </p>
            <div className="flex flex-wrap gap-2">
              {impactThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setImpactTheme(theme.id)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={
                    impactTheme === theme.id
                      ? { backgroundColor: 'var(--color-flag-yellow)', color: '#020202' }
                      : { border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.78)' }
                  }
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-4 mb-8">
            <div className="lg:col-span-7 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, rgba(210,168,85,0.12), rgba(157,193,131,0.06))', border: '1px solid rgba(210,168,85,0.3)' }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Community Commerce
              </p>
              <h2 className="font-display text-3xl font-semibold mb-2">
                Buy from Mob, build impact
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)' }}>
                Discover community-made products and support cultural programs through people-first story trails and impact-led collections.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4" data-decorative="true">
              <div className="card-dark rounded-2xl p-6">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Products
                </p>
                <p className="font-display text-3xl">{marketplaceProducts.length}</p>
              </div>
              <div className="card-dark rounded-2xl p-6">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Cart Total
                </p>
                <p className="font-display text-3xl">${cartTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={
                    category === item
                      ? { backgroundColor: 'var(--color-ochre-500)', color: 'var(--color-charcoal-950)' }
                      : { border: '1px solid rgba(65,70,72,0.6)', color: 'rgba(255,255,255,0.72)' }
                  }
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
                    className="rounded-2xl overflow-hidden group"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(65,70,72,0.45)',
                    }}
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
                      <p className="text-sm mb-4 min-h-[60px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
                        {product.description}
                      </p>
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
                        <Link
                          href={`/marketplace/vendor/${product.vendorId}`}
                          className="btn-ghost text-xs"
                        >
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
                <div className="card-dark rounded-2xl p-8 text-center">
                  <Store className="mx-auto mb-3" style={{ color: 'var(--color-ochre-400)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.62)' }}>
                    No products in this category yet.
                  </p>
                </div>
              )}
            </div>

            {showCart && (
              <aside className="card-dark rounded-2xl p-5 h-fit">
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
          <div className="w-full max-w-xl rounded-2xl p-6" style={{ backgroundColor: 'rgba(20,20,20,0.98)', border: '1px solid rgba(65,70,72,0.6)' }}>
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
