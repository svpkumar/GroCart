import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'



const Home = () => {
  return (
    <div className='mt-10'>
        <MainBanner/>{/* We have successfully mounted banner component in this page, 
        Now we have to mount it in our app */}
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter/>
    </div>
  )
}

export default Home;