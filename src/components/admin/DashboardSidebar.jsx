import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

function DashboardSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useContext(AuthContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0h-6' },
    { name: 'Admins', path: '/admin/admins', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Products', path: '/admin/products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Orders', path: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className='hidden md:flex w-64 min-h-screen bg-white border-r border-gray-200 flex-col justify-between sticky top-0'>


        {/* Navigation */}
        <nav className='flex-1 px-4 py-6'>
          <div className='mb-6'>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3'>Main</p>
            <ul className='space-y-1'>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.path)
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <svg
                      className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                    {isActive(item.path) && (
                      <div className='ml-auto w-2 h-2 bg-white rounded-full'></div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className='border-t border-gray-200 px-4 py-4'>
          <div className='flex items-center px-4 py-3 mb-3 rounded-lg bg-gray-50'>
            <div className='w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3'>
              <span className='text-white text-xs font-bold'>A</span>
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>Admin User</p>
              <p className='text-xs text-gray-500'>Administrator</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className='w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 group'
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
            <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Header with Hamburger */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40'>
        <div className='flex items-center justify-between px-4 py-3'>
          <div className='flex items-center space-x-3'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>KO</span>
              </div>
              <span className='text-lg font-bold text-gray-900'>Admin</span>
            </div>
          </div>
          <div className='text-sm text-gray-500'>
            Menu
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-30'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='px-6 py-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-black rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold'>KO</span>
            </div>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>Kick-Off</h3>
              <p className='text-xs text-gray-500'>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className='flex-1 px-4 py-6 overflow-y-auto'>
          <ul className='space-y-1'>
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    navigate(item.path)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.path)
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <svg
                    className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <button
              onClick={() => {
                logout()
                navigate('/login')
                setMobileMenuOpen(false)
              }}
              className='w-full flex items-center justify-center px-4 py-4 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200'
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout Account
            </button>
          </div>
        </nav>

        {/* Mobile Version Indicator */}
        <div className='px-4 py-3 border-t border-gray-200'>
          <p className='text-xs text-gray-500 text-center'>Mobile Admin Panel</p>
        </div>
      </aside>

      {/* Bottom Navigation Spacer for Mobile */}
      <div className='md:hidden h-16'></div>

      {/* Bottom Navigation (Mobile) - Only visible when sidebar is closed */}
      {!mobileMenuOpen && (
        <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20'>
          <ul className='flex justify-around py-3'>
            {menuItems.slice(0, 4).map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center p-2 ${isActive(item.path) ? 'text-black' : 'text-gray-600'}`}
                >
                  <svg
                    className="w-5 h-5 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className='text-xs font-medium'>{item.name}</span>
                  {isActive(item.path) && (
                    <div className='w-1.5 h-1.5 bg-black rounded-full mt-1'></div>
                  )}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className='flex flex-col items-center p-2 text-gray-600'
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className='text-xs font-medium'>More</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}

export default DashboardSidebar