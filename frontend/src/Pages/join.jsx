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
<<<<<<< HEAD
      {/* {loading?(<Spinner/>):( */}
=======
      {loading?(<Spinner/>):(
>>>>>>> aa9ed0356961870e62be6179a9cffd2bcb7a11ef
        <>
        <Navbar/>
        <Dashboard/>
        </>
<<<<<<< HEAD
      {/* )} */}
=======
      )}
>>>>>>> aa9ed0356961870e62be6179a9cffd2bcb7a11ef
    </div>
  )
}

export default Join
