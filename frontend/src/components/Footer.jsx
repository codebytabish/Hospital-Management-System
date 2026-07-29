import React from 'react'

const Footer
 = () => {
  return (
    <div className='bg-[#0a0f1e] px-5 flex flex-col  sm:flex-row   items-center      justify-between '>
{/* Logo */}
        <div>
          <img src='/synaptoclin_logo_v3.svg' className='h-16 w-auto' alt='SynaptoClin' />
        </div> 
          {/* paragraph */}
         <div>
        <p className='py-4 px-5  text-white/75 hover:text-white text-sm transition-colors'>
             © 2026 SynaptoClin.AI.All rights reserved.
        </p>
        </div>

         <div className='flex px-5 gap-3  py-4 '>
            <a  className='text-white/75 hover:text-white text-sm transition-colors' href='#'>Privacy</a>
            <a  className='text-white/75 hover:text-white text-sm transition-colors' href='#'>Terms</a>
            <a  className='text-white/75 hover:text-white text-sm transition-colors' href='#'>Contact</a>
         </div>


    </div>
  )
}

export default Footer
