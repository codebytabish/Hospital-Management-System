import React, { useState } from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='bg-[#0a0f1e]'>
      {/* Main bar */}
      <div className='flex justify-between items-center px-5 h-16'>
        
        {/* Logo */}
        <div>
          <img src='/synaptoclin_logo_v3.svg' className='h-16 w-auto' alt='SynaptoClin' />
        </div>

        {/* Desktop nav links — hidden on mobile */}
        <div className='hidden md:flex items-center gap-7'>
          <Link to='/features' className='text-white/75 hover:text-white text-sm transition-colors'>Features</Link>
          <Link to='/how-it-works' className='text-white/75 hover:text-white text-sm transition-colors'>How it works</Link>
          <Link to='/for-doctors' className='text-white/75 hover:text-white text-sm transition-colors'>For Doctors</Link>
        </div>

        {/* Desktop actions — hidden on mobile */}
        <div className='hidden md:flex items-center gap-3'>
          <Link to='/login' className='border rounded-md border-white/25 py-2 px-4 text-white/75 hover:text-white text-sm transition-colors'>Login</Link>
          <Link to='/get-started' className=' text-white text-sm px-4 py-2 rounded-md transition-colors'
          style={{background:'linear-gradient(15deg,#4f8ef7,#a855f7)'}}
          >
            Get Started
          </Link>
        </div>

        {/* Hamburger — visible on mobile only */}
        <button
          className='md:hidden flex flex-col gap-1.5 p-1 cursor-pointer'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'
        >
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className='md:hidden bg-[#0d1426] border-t border-white/10 px-5 pb-4 flex flex-col'>
          <Link to='/features'    className='text-white/75 py-3 border-b border-white/5 text-sm' onClick={() => setMenuOpen(false)}>Features</Link>
          <Link to='/how-it-works' className='text-white/75 py-3 border-b border-white/5 text-sm' onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link to='/for-doctors' className='text-white/75 py-3 border-b border-white/5 text-sm' onClick={() => setMenuOpen(false)}>For Doctors</Link>
          <Link to='/login'       className='text-white/75 py-3 border-b border-white/5 text-sm' onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to='/get-started' className='text-blue-400 font-medium py-3 text-sm'            onClick={() => setMenuOpen(false)}>Get Started →</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar