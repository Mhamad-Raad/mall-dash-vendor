import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';
import { fetchOrders } from '@/store/slices/ordersSlice';
import type { OrderStatus } from '@/interfaces/Order.interface';

import OrdersFilters from '@/components/Orders/OrdersFilters';
import OrderList from '@/components/Orders/OrderList';
import OrderDisplay from '@/components/Orders/OrderDisplay';
import EmptyState from '@/components/Orders/EmptyState';
import CustomTablePagination from '@/components/CustomTablePagination';

import { Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Orders = () => {
  const [searchParams] = useSearchParams();
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

  const lastFetchParams = useRef<string>('');

  useEffect(() => {
    const params: {
      limit: number;
      page: number;
      status?: OrderStatus | 'All' | null;
    } = {
      limit,
      page,
      status: status || 'All',
    };

    // Prevent duplicate fetches for same params
    const paramsString = JSON.stringify(params);
    if (lastFetchParams.current === paramsString && !loading) {
      return;
    }
    lastFetchParams.current = paramsString;

    dispatch(fetchOrders(params));
  }, [dispatch, limit, page, status]);

  // Auto-select first order when orders load
  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

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
    <section className='flex-1 flex flex-col overflow-hidden -m-6'>
      {/* Filters Section */}
      <div className='px-6 py-4 border-b bg-background flex-shrink-0'>
        <OrdersFilters />
      </div>

      {/* Main Content Area */}
      <div className='flex-1 min-h-0 flex'>{hasNoOrders ? (
          <EmptyState />
        ) : (
          <div className='flex h-full w-full'>
                {/* Left Panel - Order List */}
                <div className='w-[350px] border-r flex flex-col'>
                  <div className='flex items-center px-4 py-3 border-b'>
                    <h2 className='text-sm font-semibold'>
                      Orders ({total})
                    </h2>
                  </div>
                  <div className='flex-1 min-h-0'>
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
                  <div className='border-t p-2'>
                    <CustomTablePagination
                      total={total}
                      suggestions={[10, 20, 30, 40, 50]}
                    />
                  </div>
                </div>

                {/* Right Panel - Order Details */}
                <div className='flex-1 min-h-0'>
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

