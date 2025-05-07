import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation} from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import AddProducts from './pages/seller/AddProducts';
import Home from './pages/Home';
import Loading from './components/Loading';

{/* This is the main App component that contains the routing logic for the application */}
{/* It uses react-router-dom for routing and react-hot-toast for notifications */}
{/* The App component is wrapped in a context provider to manage global state */}

const App = () => {{/* here we are using useLocation hook for checking weather we are in seller dashboard or normal user*/}
  const isSellerPath = useLocation().pathname.includes('/seller');{/* This will check if the current path includes /seller */}
  const {showUserLogin, isSeller} = useAppContext(); 
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      <Toaster />{/* This is used to display toast notifications */}
      {isSellerPath ? null : <Navbar /> } {/*navbar is displayed for normal user not for sellers Navbar will be displayed in every page*/}
      {showUserLogin ? <Login/> : null} {/* This will show the login component when the user is not logged in */}
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>{/* padding x-16 for medium screen, next for large screen and so on */}
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<AllProducts/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/loader' element={<Loading/>} />
          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={<AddProducts />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App;