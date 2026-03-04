import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { marketplaceProducts } from '@/lib/marketplace-data'

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const products = marketplaceProducts.filter((product) => product.vendorId === id)

  if (products.length === 0) {
    notFound()
  }

  const vendorName = products[0].vendorName

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title={vendorName}
        subtitle="Vendor Profile"
        description={`${products.length} product${products.length === 1 ? '' : 's'} listed in marketplace preview.`}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: vendorName },
        ]}
      />

      <section className="section-padding py-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(65,70,72,0.45)', backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={640}
                  height={352}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <h2 className="font-display text-xl mb-2">{product.name}</h2>
                  <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.62)' }}>
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-display text-2xl" style={{ color: 'var(--color-ochre-400)' }}>
                      ${product.price}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {product.category}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

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
