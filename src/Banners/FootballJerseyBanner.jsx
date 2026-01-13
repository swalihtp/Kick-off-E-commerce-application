import { useState, useEffect } from 'react'
import axios from 'axios'

function FootballJerseyBanner () {
  const [jersey, setJerseys] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    axios
      .get('http://localhost:5000/jerseys')
      .then(res => setJerseys(res.data))
      .catch(err => console.log(err))
  }, [])

  const prevJersey = () => {
    setIndex(prev => (prev === 0 ? jersey.length - 1 : prev - 1))
  }

  const nextJersey = () => {
    setIndex(prev => (prev === jersey.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className='mt-4 relative flex items-center justify-between rounded-xl bg-gray-100 px-6 py-10 shadow-md'>
      
      {/* LEFT BUTTON */}
      <button
        onClick={prevJersey}
        className='text-4xl font-bold text-gray-600 transition hover:scale-125 hover:text-black'
      >
        ‹
      </button>

      {/* CONTENT */}
      {jersey.length > 0 && (
        <div className='flex w-full max-w-5xl items-center justify-between gap-8 px-6'>
          
          {/* TEXT */}
          <div className='max-w-md'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>
              {jersey[index].tagline}
            </h2>
            <button className='rounded-md bg-black px-6 py-2 font-semibold text-white transition hover:scale-105 hover:bg-gray-800'>
              Shop now
            </button>
          </div>

          {/* IMAGE */}
          <div className='flex flex-col items-center'>
            <img
              src={jersey[index].image}
              alt={jersey[index].name}
              className='h-64 w-auto object-contain transition-transform duration-300 hover:scale-110'
            />
            <h2 className='mt-4 text-lg font-semibold text-gray-800'>
              {jersey[index].name}
            </h2>
          </div>
        </div>
      )}

      {/* RIGHT BUTTON */}
      <button
        onClick={nextJersey}
        className='text-4xl font-bold text-gray-600 transition hover:scale-125 hover:text-black'
      >
        ›
      </button>
    </div>
  )
}

export default FootballJerseyBanner
