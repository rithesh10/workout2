import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import Dashboard from './Dashboard'
import Spinner from '../components/Spinner';

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
        </>

    </div>
  )
}

export default Join
