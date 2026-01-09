import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Package,
  Calendar,
  DollarSign,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { fetchOrderById } from '@/data/Orders';
import { changeOrderStatus } from '@/store/slices/ordersSlice';
import type { AppDispatch } from '@/store/store';
import type { Order, OrderStatus } from '@/interfaces/Order.interface';
import { getStatusText } from '@/utils/orderUtils';
import { toast } from 'sonner';

import { formatDate } from '@/utils/dateUtils';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchOrderById(Number(id));
        if ('error' in result) {
          setError(result.error);
        } else {
          setOrder(result);
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const getStatusColor = (status: OrderStatus | number) => {
    const statusText = getStatusText(status);
    switch (statusText) {
      case 'Pending':
        return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
      case 'Confirmed':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
      case 'Preparing':
        return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
      case 'OutForDelivery':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30';
    }
  };

  const handleStatusChange = async (newStatus: number) => {
    if (!order) return;
    setUpdating(true);
    try {
      await dispatch(
        changeOrderStatus({ id: order.id, status: newStatus })
      ).unwrap();

      // Update local state
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success('Order status updated successfully');
    } catch (err) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const renderActionButtons = () => {
    if (!order) return null;
    const statusText = getStatusText(order.status);

    if (statusText === 'Pending') {
      return (
        <>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleStatusChange(6)} // Cancelled
            disabled={updating}
          >
            {updating ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Cancel Order'
            )}
          </Button>
          <Button
            size='sm'
            onClick={() => handleStatusChange(2)} // Confirmed
            disabled={updating}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {updating ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Confirm Order'
            )}
          </Button>
        </>
      );
    }

    if (statusText === 'Confirmed') {
      return (
        <Button
          size='sm'
          onClick={() => handleStatusChange(3)} // Preparing
          disabled={updating}
          className='bg-indigo-600 hover:bg-indigo-700'
        >
          {updating ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            'Start Preparing'
          )}
        </Button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-8'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Order not found'}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/orders')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 h-full overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/orders')}
            className='h-8 w-8 rounded-full'
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Order #{order.orderNumber}
            </h1>
            <div className='flex items-center gap-2 text-muted-foreground text-sm mt-1'>
              <Calendar className='h-3.5 w-3.5' />
              <span>
                {formatDate(new Date(order.createdAt), 'MMM dd, yyyy')}
              </span>
              <span>•</span>
              <Clock className='h-3.5 w-3.5' />
              <span>{formatDate(new Date(order.createdAt), 'hh:mm a')}</span>
              {order.completedAt && (
                <>
                  <span>•</span>
                  <CheckCircle className='h-3.5 w-3.5 text-emerald-500' />
                  <span className='text-emerald-600 font-medium'>
                    Completed:{' '}
                    {formatDate(new Date(order.completedAt), 'MMM dd, hh:mm a')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {renderActionButtons()}
          <Badge
            variant='secondary'
            className={`text-sm px-3 py-1 ${getStatusColor(order.status)}`}
          >
            {getStatusText(order.status)}
          </Badge>
        </div>
      </div>

      <ScrollArea className='flex-1 -mx-6 px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6'>
          {/* Main Content - Left Column */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Package className='h-5 w-5 text-primary' />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <div className='divide-y'>
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className='p-4 flex items-center justify-between hover:bg-muted/30 transition-colors'
                    >
                      <div className='flex items-center gap-4'>
                        {item.productImageUrl ? (
                          <img
                            src={item.productImageUrl.trim()}
                            alt={item.productName}
                            className='h-12 w-12 rounded-lg object-cover bg-muted'
                          />
                        ) : (
                          <div className='h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-medium text-sm'>
                            x{item.quantity}
                          </div>
                        )}
                        <div>
                          <p className='font-medium'>{item.productName}</p>
                          <p className='text-sm text-muted-foreground'>
                            ${item.unitPrice.toFixed(2)} per unit
                            {item.productImageUrl && (
                              <span className='ml-2 text-xs bg-muted px-1.5 py-0.5 rounded'>
                                x{item.quantity}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className='font-semibold'>
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {!order.items?.length && (
                    <div className='p-8 text-center text-muted-foreground'>
                      No items found for this order.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <DollarSign className='h-5 w-5 text-primary' />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className='space-y-6'>
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <User className='h-5 w-5 text-primary' />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                    <User className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='font-medium'>
                      {order.userName || order.customerName || 'Guest Customer'}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      ID: {order.userId.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className='space-y-2 pt-2'>
                  {order.userEmail && (
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Mail className='h-3.5 w-3.5' />
                      <span className='truncate'>{order.userEmail}</span>
                    </div>
                  )}
                  {order.userPhone && (
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Phone className='h-3.5 w-3.5' />
                      <span>{order.userPhone}</span>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <>
                    <Separator />
                    <div className='space-y-1.5'>
                      <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Notes
                      </span>
                      <p className='text-sm bg-muted/50 p-3 rounded-lg border'>
                        "{order.notes}"
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Delivery Info (Placeholder if address not in model yet, but prepared) */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <MapPin className='h-5 w-5 text-primary' />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                      Method
                    </span>
                    <span className='text-sm font-medium'>
                      Standard Delivery
                    </span>
                  </div>

                  {order.deliveryAddress ? (
                    <div className='flex flex-col gap-1'>
                      <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Address
                      </span>
                      <div className='text-sm font-medium flex flex-col'>
                        <span>{order.deliveryAddress.buildingName}</span>
                        <span className='text-muted-foreground font-normal'>
                          Floor {order.deliveryAddress.floorNumber},{' '}
                          {order.deliveryAddress.apartmentName}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className='flex flex-col gap-1'>
                      <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Address
                      </span>
                      <span className='text-sm text-muted-foreground italic'>
                        No delivery address provided
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderDetail;

