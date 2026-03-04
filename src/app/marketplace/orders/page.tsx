import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { marketplaceOrders } from '@/lib/marketplace-data'

export default function OrdersPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Order History"
        subtitle="Marketplace transactions"
        description="Preview order activity for the marketplace experience."
        breadcrumbs={[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Orders' }]}
      />

      <section className="section-padding py-16">
        <div className="container-wide">
          {marketplaceOrders.length === 0 ? (
            <div className="card-dark rounded-2xl p-10 text-center">
              <ShoppingBag className="mx-auto mb-3" style={{ color: 'var(--color-ochre-400)' }} />
              <p style={{ color: 'rgba(255,255,255,0.62)' }}>No orders yet.</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(65,70,72,0.55)' }}>
              <table className="w-full text-left">
                <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <tr>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Order</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Total</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Status</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {marketplaceOrders.map((order) => (
                    <tr key={order.id} style={{ borderTop: '1px solid rgba(65,70,72,0.4)' }}>
                      <td className="px-5 py-4">{order.id}</td>
                      <td className="px-5 py-4">${order.total.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={
                            order.status === 'completed'
                              ? { backgroundColor: 'rgba(157,193,131,0.2)', color: 'var(--color-sage-400)' }
                              : { backgroundColor: 'rgba(251,191,36,0.18)', color: '#fbbf24' }
                          }
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">{new Date(order.createdAt).toLocaleDateString('en-AU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6">
            <Link href="/marketplace" className="btn-ghost text-sm">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
