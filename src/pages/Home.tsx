import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  { day: 'Dec 1', orders: 8, profit: 1250.0 },
  { day: 'Dec 2', orders: 23, profit: 420.5 },
  { day: 'Dec 3', orders: 15, profit: 890.75 },
  { day: 'Dec 4', orders: 28, profit: 1520.0 },
  { day: 'Dec 5', orders: 12, profit: 340.25 },
  { day: 'Dec 6', orders: 19, profit: 2100.0 },
  { day: 'Dec 7', orders: 31, profit: 780.5 },
  { day: 'Dec 8', orders: 9, profit: 1680.0 },
  { day: 'Dec 9', orders: 25, profit: 950.25 },
  { day: 'Dec 10', orders: 17, profit: 520.0 },
  { day: 'Dec 11', orders: 22, profit: 1890.75 },
  { day: 'Dec 12', orders: 14, profit: 670.5 },
  { day: 'Dec 13', orders: 27, profit: 1150.0 },
  { day: 'Dec 14', orders: 10, profit: 2340.25 },
  { day: 'Dec 15', orders: 20, profit: 810.0 },
  { day: 'Dec 16', orders: 36, profit: 1420.5 },
];

const Home = () => {
  const { t } = useTranslation();
  const { profile } = useSelector((state: RootState) => state.vendor);

  // Cards info based on dummy data
  const cardsInfo = [
    {
      title: t('home.cardEmployeesTitle'),
      value: dummyStats.employees,
      badge: { text: t('home.cardEmployeesBadge'), trendingUp: null },
      footer: t('home.cardEmployeesFooter'),
    },
    {
      title: t('home.cardStaffTitle'),
      value: dummyStats.staff,
      badge: { text: t('home.cardStaffBadge'), trendingUp: true },
      footer: t('home.cardStaffFooter'),
    },
    {
      title: t('home.cardDriversTitle'),
      value: dummyStats.drivers,
      badge: { text: t('home.cardDriversBadge'), trendingUp: null },
      footer: t('home.cardDriversFooter'),
    },
  ];

  return (
    <div className='flex flex-col gap-4 w-full p-2'>
      {/* Welcome Message */}
      {profile && (
        <div className='flex flex-col gap-1 mb-4'>
          <h1 className='text-3xl md:text-4xl font-bold'>
            {t('home.welcomeTitle', { name: profile.name })}
          </h1>
          <p className='text-muted-foreground text-lg'>
            {t('home.welcomeSubtitle')}
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
