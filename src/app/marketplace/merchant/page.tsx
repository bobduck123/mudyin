'use client'

import Link from 'next/link'
import { CreditCard, Package, TrendingUp } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { marketplaceOrders, marketplaceProducts } from '@/lib/marketplace-data'

export default function MerchantPage() {
  const totalRevenue = marketplaceOrders
    .filter((order) => order.status === 'completed')
    .reduce((total, order) => total + order.total, 0)

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Merchant Dashboard"
        subtitle="Marketplace overview"
        description="Track listings, preview sales performance, and monitor order activity."
        breadcrumbs={[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Merchant' }]}
      />

      <section className="section-padding py-16">
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="card-dark p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard size={18} style={{ color: 'var(--color-sage-400)' }} />
                <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Revenue
                </p>
              </div>
              <p className="font-display text-3xl">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="card-dark p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Package size={18} style={{ color: 'var(--color-ochre-400)' }} />
                <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Active Listings
                </p>
              </div>
              <p className="font-display text-3xl">{marketplaceProducts.length}</p>
            </div>
            <div className="card-dark p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={18} style={{ color: 'var(--color-sage-400)' }} />
                <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Open Orders
                </p>
              </div>
              <p className="font-display text-3xl">
                {marketplaceOrders.filter((order) => order.status === 'pending').length}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/marketplace" className="card-dark p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <p className="font-semibold mb-1">Manage Listings</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Add and maintain products in your storefront.
              </p>
            </Link>
            <Link href="/marketplace/orders" className="card-dark p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <p className="font-semibold mb-1">View Orders</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Inspect recent order and fulfilment status.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
