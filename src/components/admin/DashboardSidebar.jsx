import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

function DashboardSidebar () {
  const navigate = useNavigate()
  const menuItems = ['Users','Admins', 'Products', 'Orders']
  const { logout } = useContext(AuthContext)

  return (
    <>
      {/* Sidebar (Desktop) */}
      <aside className='hidden md:flex w-64 bg-white border-r border-gray-200 flex-col justify-between'>
        <nav className='px-4 py-6'>
          <ul className='space-y-2'>
            <li
              onClick={() => navigate('/admin')}
              className='px-4 py-2 rounded-lg text-gray-700 font-medium cursor-pointer
                           hover:bg-black hover:text-white transition'
            >
              Dashboard
            </li>
            {menuItems.map(item => (
              <li
                key={item}
                onClick={() => navigate(`/admin/${item.toLowerCase()}`)}
                className='px-4 py-2 rounded-lg text-gray-700 font-medium cursor-pointer
                           hover:bg-black hover:text-white transition'
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>

        <div className='px-4 py-4 border-t'>
          <button
            className='w-full py-2 text-sm font-medium text-red-600 rounded-lg
                       hover:bg-red-50 transition'
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Bottom Navigation (Mobile) */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg'>
        <ul className='flex justify-around py-3'>
          <li
            className='text-sm font-medium text-gray-600 cursor-pointer
                         hover:text-black transition'
            onClick={()=>navigate('/admin')}
          >
            Dashboard
          </li>
          {menuItems.map(item => (
            <li
              key={item}
              onClick={() => navigate(`/admin/${item.toLowerCase()}`)}
              className='text-sm font-medium text-gray-600 cursor-pointer
                         hover:text-black transition'
            >
              {item}
            </li>
          ))}
          <li
            className='text-sm font-medium text-red-600 cursor-pointer
                         hover:text-black transition'
            onClick={()=>logout()}
          >
            logout
          </li>
        </ul>
      </nav>
    </>
  )
}

export default DashboardSidebar
