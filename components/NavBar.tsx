import Link from 'next/link';
export default function NavBar() {
 return (
 <nav className='bg-white shadow-md'>
 <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
 <Link href='/'>
 <span className='text-2xl font-bold text-blue-600'>外匯車專賣</span>
 </Link>
 <div className='space-x-4'>
 <Link href='/vehicles' className='text-gray-600 hover:text-blue-600'>庫存車輛</Link>
 <Link href='/about' className='text-gray-600 hover:text-blue-600'>關於我們</Link>
 <Link href='/contact' className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700'>聯絡我們</Link>
 </div>
 </div>
 </nav>
 );
}
