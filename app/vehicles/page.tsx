import NavBar from '@/components/NavBar'
import VehicleCard from '@/components/VehicleCard'
import { prisma } from '@/lib/prisma'

function getImageForModel(model: string) {
 const lower = model.toLowerCase()
 if (lower.includes('bmw')) return '/images/bmw.svg'
 if (lower.includes('mercedes') || lower.includes('c300')) return '/images/c300.svg'
 return '/images/c300.svg'
}

export default async function VehiclesPage() {
 const vehicles = await prisma.vehicle.findMany({
  orderBy: [{ createdAt: 'desc' }],
 })

 return (
  <>
   <NavBar />
   <div className='container mx-auto px-4 py-10'>
    <h2 className='mb-6 text-3xl font-bold text-zinc-900'>庫存車輛</h2>
    <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
     {vehicles.map((v) => (
      <VehicleCard
       key={v.id}
       model={v.model}
       year={v.year}
       mileage={v.mileage}
       price={v.price}
       imageUrl={getImageForModel(v.model)}
      />
     ))}
    </div>
    {vehicles.length === 0 ? <p className='mt-8 text-zinc-500'>目前尚無庫存車輛。</p> : null}
   </div>
  </>
 )
}
