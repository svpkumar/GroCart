import React,{use, useState} from 'react'
import { useEffect } from 'react'; // Importing useEffect hook from React
import { useAppContext } from '../context/AppContext'; // Importing AppContext to access global state
import ProductCard from '../components/ProductCard'; // Importing ProductCard component to display individual products

const AllProducts = () => {
    const  {products, searchQuery} = useAppContext(); // Destructuring products from AppContext
    const [filteredProducts,setfilteredProducts] = useState([]); // State to store filtered products

    useEffect(() => {
        if(searchQuery.length > 0){
            setfilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        } else{
            setfilteredProducts(products); // If no search query, show all products
        }
    },[products, searchQuery]) // Effect to filter products based on search query
  return (
    <div className='mt-16 flex flex-col'>
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium uppercase'>All Products</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
            {filteredProducts.filter((product)=>product.inStock).map((product,index)=>(
                <ProductCard key={index} product={product} /> // Map through filtered products and render ProductCard component
            ))}
        </div>
    </div>
  )
}

export default AllProducts