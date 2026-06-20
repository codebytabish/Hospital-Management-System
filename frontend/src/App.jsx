import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from '../components/Navbar'
import ForDoctors from '../pages/ForDoctors';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../Components/HowItWorks';
import Stats from '../components/Stats';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     <Hero/>
     <Stats/>
     <Features/>
     <HowItWorks/>
     <Routes>
</Routes>

    </>
  )
}

export default App
