import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <div className='relative'>  {/* to mount it in website we create Home page */}
        <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block'/>
        {/* adding home banner from assets folder, class name is width full hidden and medium block, 
        It will be hidden in mobile view,for medium and above screen it will be visible */}
        <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden'/>
        {/* Why This Is Used
        This is a responsive design pattern — you're loading:
        a smaller image (main_banner_bg_sm) on mobile
        a larger image (main_banner_bg) on tablet and desktop */}
        <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15'>
            Freshness You can Trust, Savings You will Love!</h1>
        <div className='flex items-center mt-5 font-medium'>{/* using css we group both links */}
            <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
            Shop now
            <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="arrow" />
            </Link>
            <Link to={"/products"} className='group hidden md:flex items-center gap-2 px-7 md:px-9 py-3 cursor-pointer'>
            Explore deals
            <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
            </Link>
        </div>
        </div>
    </div>
  )
}

export default MainBanner