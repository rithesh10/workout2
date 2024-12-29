import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import Dashboard from './Dashboard'
import Spinner from '../../components/Spinner';
import Footer from '../../components/Footer';

const Join = () => {
  const [loading,setloading]=useState(true);
  useEffect(()=>{
    const timer=setTimeout(()=>{
      setloading(false)
    },1000);
    return ()=>clearTimeout(timer);
  },[])
  return (
    <div>
        <>
        <Navbar/>
        <Dashboard/>
        {/* <Footer/> */}
        </>

    </div>
  )
}

export default Join
