import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, Sparkles, SlidersHorizontal } from 'lucide-react';
import type { OrderStatus } from '@/interfaces/Order.interface';

const OrdersFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentStatus = searchParams.get('status') || 'All';

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    params.set('page', '1'); // Reset to first page
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const orderStatuses: (OrderStatus | 'All')[] = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'OutForDelivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className='flex flex-col gap-5'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-40' />
            <div className='relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
              <ShoppingCart className='size-7' />
            </div>
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
              <Sparkles className='size-5 text-amber-500' />
            </div>
            <p className='text-muted-foreground mt-0.5'>
              Manage and track your customer orders
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <SlidersHorizontal className='size-4' />
          <span className='text-sm font-medium'>Filters</span>
        </div>

        <div className='flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-3 w-full'>
          {/* Status Filter */}
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className='w-full sm:w-[200px] h-10 bg-background/80 border-border/50 rounded-xl'>
              <SelectValue placeholder='Filter by Status' />
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'All' ? 'All Orders' : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilters;

