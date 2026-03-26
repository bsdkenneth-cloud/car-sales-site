import NavBar from '@/components/NavBar'
import VehicleCard from '@/components/VehicleCard'
import { prisma } from '@/lib/prisma'

type HomepageVehicle = {
 model: string
 year: number
 mileage: number
 price: number
 imageUrl: string
}

function getImageForModel(model: string) {
 const lower = model.toLowerCase()
 if (lower.includes('bmw')) return '/images/bmw.svg'
 if (lower.includes('mercedes') || lower.includes('c300')) return '/images/c300.svg'
 return '/images/c300.svg'
}

async function getFeaturedVehicles(): Promise<HomepageVehicle[]> {
 const vehicles = await prisma.vehicle.findMany({
  orderBy: [{ price: 'asc' }],
  take: 6,
 })

 if (vehicles.length === 0) {
  return [
   { model: 'BMW 428i', year: 2020, mileage: 22000, price: 1280000, imageUrl: '/images/bmw.svg' },
   { model: 'Mercedes C300', year: 2019, mileage: 35000, price: 980000, imageUrl: '/images/c300.svg' },
  ]
 }

 return vehicles.map((vehicle) => ({
  model: vehicle.model,
  year: vehicle.year,
  mileage: vehicle.mileage,
  price: vehicle.price,
  imageUrl: getImageForModel(vehicle.model),
 }))
}

export default async function Home() {
 const featured = await getFeaturedVehicles()

 return (
  <>
   <NavBar />
   <section className='bg-gray-100 py-20'>
    <div className='container mx-auto px-4 text-center'>
     <h1 className='mb-4 text-4xl font-bold text-blue-700'>外匯車專賣</h1>
     <p className='mb-10 text-gray-600'>提供高品質美國平行輸入車輛與專業代辦服務</p>
     <div className='grid gap-8 md:grid-cols-2 xl:grid-cols-3'>
      {featured.map((v) => <VehicleCard key={`${v.model}-${v.year}`} {...v} />)}
     </div>
    </div>
   </section>
  </>
 )
}
