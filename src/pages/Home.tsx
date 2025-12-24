import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import CardsHome from '@/components/Home/CardsHome';
import OrdersProfitChart from '@/components/Home/OrdersProfitChart';

// Dummy data for demonstration
const dummyStats = {
  employees: 24,
  staff: 18,
  drivers: 6,
};

// Dummy orders and profit data for the current month (December 2025)
const ordersData = [
  { day: 'Dec 1', orders: 8, profit: 1250.00 },
  { day: 'Dec 2', orders: 23, profit: 420.50 },
  { day: 'Dec 3', orders: 15, profit: 890.75 },
  { day: 'Dec 4', orders: 28, profit: 1520.00 },
  { day: 'Dec 5', orders: 12, profit: 340.25 },
  { day: 'Dec 6', orders: 19, profit: 2100.00 },
  { day: 'Dec 7', orders: 31, profit: 780.50 },
  { day: 'Dec 8', orders: 9, profit: 1680.00 },
  { day: 'Dec 9', orders: 25, profit: 950.25 },
  { day: 'Dec 10', orders: 17, profit: 520.00 },
  { day: 'Dec 11', orders: 22, profit: 1890.75 },
  { day: 'Dec 12', orders: 14, profit: 670.50 },
  { day: 'Dec 13', orders: 27, profit: 1150.00 },
  { day: 'Dec 14', orders: 10, profit: 2340.25 },
  { day: 'Dec 15', orders: 20, profit: 810.00 },
  { day: 'Dec 16', orders: 36, profit: 1420.50 },
];

const Home = () => {
  const { profile } = useSelector((state: RootState) => state.vendor);

  // Cards info based on dummy data
  const cardsInfo = [
    {
      title: 'Employees',
      value: dummyStats.employees,
      badge: { text: 'Total', trendingUp: null },
      footer: 'Total employees in your store',
    },
    {
      title: 'Staff',
      value: dummyStats.staff,
      badge: { text: '+3 this month', trendingUp: true },
      footer: 'Active staff members',
    },
    {
      title: 'Drivers',
      value: dummyStats.drivers,
      badge: { text: 'Available', trendingUp: null },
      footer: 'Delivery drivers',
    },
  ];

  return (
    <div className='flex flex-col gap-4 w-full p-2'>
      {/* Welcome Message */}
      {profile && (
        <div className='flex flex-col gap-1 mb-4'>
          <h1 className='text-3xl md:text-4xl font-bold'>Welcome back, {profile.name}!</h1>
          <p className='text-muted-foreground text-lg'>
            Here's an overview of your team.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <CardsHome cards={cardsInfo} />

      {/* Orders & Profit Chart */}
      <OrdersProfitChart data={ordersData} />
    </div>
  );
};

export default Home;
