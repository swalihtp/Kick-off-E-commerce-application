import { useState } from 'react'
import DateFilter from '../components/DateFilter'
import DashboardCards from '../components/DashboardCards'
import OrdersChart from '../Charts/OrdersChart'
import OrderStatusChart from '../Charts/OrderStatusChart'
import useDashboardAnalytics from '../hooks/useDashboardAnalytics'

import DashboardHeader from '../components/admin/DashboardHeader'
import DashboardSidebar from '../components/admin/DashboardSidebar'

function TestingDashboard() {
  const [days, setDays] = useState(30)
  const { data, loading } = useDashboardAnalytics(days)
  console.log(data); 
  if (loading || !data) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-600'>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      {/* Header */}
      <DashboardHeader />

      {/* Main Layout */}
      <div className='flex flex-1'>
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className='flex-1 p-6'>
          <DateFilter days={days} setDays={setDays} />

          <DashboardCards cards={data.cards} />

          <div className=''>
            <OrdersChart data={data.orders_by_day} />
          </div>

          <div className='mt-6'>
            <OrderStatusChart data={data.order_status} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default TestingDashboard
