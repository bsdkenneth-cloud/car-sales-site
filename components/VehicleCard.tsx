import Image from 'next/image'

interface Props {
 model: string
 year: number
 mileage: number
 price: number
 imageUrl: string
}

export default function VehicleCard({ model, year, mileage, price, imageUrl }: Props) {
 return (
 <div className='overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg'>
 <div className='relative h-48 w-full'>
 <Image src={imageUrl} alt={model} fill className='object-cover' />
 </div>
 <div className='p-4'>
 <h3 className='text-xl font-semibold text-zinc-900'>{model} ({year})</h3>
 <p className='text-gray-500'>里程 {mileage.toLocaleString()} km</p>
 <p className='mt-2 font-bold text-blue-600'>NT${price.toLocaleString()}</p>
 </div>
 </div>
 )
}
