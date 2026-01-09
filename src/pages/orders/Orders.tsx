import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';
import { fetchOrders } from '@/store/slices/ordersSlice';
import type { OrderStatus } from '@/interfaces/Order.interface';

import OrderList from '@/components/Orders/OrderList';
import OrderDisplay from '@/components/Orders/OrderDisplay';
import EmptyState from '@/components/Orders/EmptyState';
import CustomTablePagination from '@/components/CustomTablePagination';

import { Inbox, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const orderStatuses: (OrderStatus | 'All')[] = [
  'All',
  'Pending',
  'Confirmed',
  'Preparing',
  'OutForDelivery',
  'Delivered',
  'Cancelled',
];

const Orders = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { orders, loading, error, total } = useSelector(
    (state: RootState) => state.orders
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    id ? parseInt(id, 10) : null
  );

  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const statusParam = searchParams.get('status');
  const status = (statusParam === 'All' ? 'All' : statusParam) as
    | OrderStatus
    | 'All'
    | null;
  const searchQuery = searchParams.get('search') || '';

  const lastFetchParams = useRef<string>('');

  useEffect(() => {
    const params: {
      limit: number;
      page: number;
      status?: OrderStatus | 'All' | null;
      search?: string;
    } = {
      limit,
      page,
      status: status || 'All',
    };

    if (searchQuery) {
      params.search = searchQuery;
    }

    // Prevent duplicate fetches for same params
    const paramsString = JSON.stringify(params);
    if (lastFetchParams.current === paramsString && !loading) {
      return;
    }
    lastFetchParams.current = paramsString;

    dispatch(fetchOrders(params));
  }, [dispatch, limit, page, status, searchQuery]);

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const value = e.target.value;
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  // Auto-select first order when orders load
  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId && !id) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId, id]);

  // Sync with URL parameter
  useEffect(() => {
    if (id) {
      setSelectedOrderId(parseInt(id, 10));
    }
  }, [id]);

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    // Optionally update URL without navigation
    // navigate(`/orders/${orderId}`, { replace: true });
  };

  const hasNoOrders = !loading && orders.length === 0 && !error;

  return (
    <section className='flex-1 flex flex-col min-h-0 -m-6'>
      {/* Main Content Area */}
      <div className='flex-1 flex overflow-hidden'>
        {hasNoOrders && !searchQuery && status === 'All' ? (
          <EmptyState />
        ) : (
          <div className='flex h-full w-full'>
            {/* Left Panel - Order List */}
            <div className='w-[350px] border-r flex flex-col bg-muted/10'>
              <div className='p-3 space-y-2 bg-background'>
                <div className='relative'>
                  <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Search orders...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className='pl-8 h-8 text-xs bg-muted/40 border-none shadow-none focus-visible:ring-1'
                  />
                </div>
                
                <div className='flex items-center justify-between'>
                  <h2 className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider'>
                    {total} Orders
                  </h2>
                  <Select value={status || 'All'} onValueChange={handleStatusChange}>
                    <SelectTrigger className='w-auto h-auto min-h-0 py-0.5 pl-1.5 pr-1 text-[11px] border-none shadow-none bg-transparent hover:bg-muted/50 rounded-md gap-1'>
                      <div className="flex items-center gap-1 text-foreground/80">
                        <Filter className="h-3 w-3" />
                        <span className="font-medium">{status === 'All' || !status ? 'All Views' : status}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent align="end">
                      {orderStatuses.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {s === 'All' ? 'All Orders' : s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className='flex-1 min-h-0 bg-background'>
                {loading ? (
                  <div className='flex flex-col gap-2 p-4'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className='flex flex-col gap-2 rounded-lg border p-3'>
                        <Skeleton className='h-4 w-3/4' />
                        <Skeleton className='h-3 w-1/2' />
                        <Skeleton className='h-3 w-full' />
                      </div>
                    ))}
                  </div>
                ) : (
                  <OrderList
                    orders={orders}
                    selectedOrderId={selectedOrderId}
                    onSelectOrder={handleSelectOrder}
                  />
                )}
              </div>
              <div className='border-t p-2 bg-background'>
                <CustomTablePagination
                  total={total}
                  suggestions={[10, 20, 30, 40, 50]}
                />
              </div>
            </div>

            {/* Right Panel - Order Details */}
            <div className='flex-1 min-h-0 bg-background'>
              {selectedOrderId ? (
                <OrderDisplay orderId={selectedOrderId} />
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <div className='flex flex-col items-center gap-2 text-center'>
                    <Inbox className='h-12 w-12 text-muted-foreground/50' />
                    <p className='text-sm text-muted-foreground'>
                      Select an order to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;

