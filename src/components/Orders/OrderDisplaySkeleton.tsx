import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const OrderDisplaySkeleton = () => {
  return (
    <div className='h-full overflow-hidden'>
      <div className='flex flex-col h-full'>
        {/* Header Skeleton */}
        <div className='px-6 py-5 border-b bg-muted/30'>
          <div className='flex items-center justify-between mb-2'>
            <div className='space-y-2'>
              <Skeleton className='h-7 w-32' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-40' />
              </div>
            </div>
            <Skeleton className='h-6 w-20 rounded-full' />
          </div>
        </div>

        {/* Customer & Delivery Skeleton */}
        <div className='px-6 py-5 border-b'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Customer Skeleton */}
            <div className='space-y-4'>
              <Skeleton className='h-3 w-16' />
              <div className='flex items-center gap-3'>
                <Skeleton className='h-11 w-11 rounded-full' />
                <div className='space-y-2 flex-1'>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='h-4 w-40' />
                  <Skeleton className='h-4 w-24' />
                </div>
              </div>
            </div>

            {/* Delivery Skeleton */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-3 w-3 rounded-full' />
                <Skeleton className='h-3 w-24' />
              </div>
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <Skeleton className='h-4 w-4 rounded' />
                    <div className='space-y-1'>
                      <Skeleton className='h-3 w-12' />
                      <Skeleton className='h-4 w-24' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Skeleton */}
        <div className='px-6 py-5 border-b'>
          <Skeleton className='h-3 w-20 mb-4' />
          <div className='space-y-4'>
            {[1, 2].map((i) => (
              <div key={i} className='flex items-center gap-4'>
                <Skeleton className='h-16 w-16 rounded-lg' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <Skeleton className='h-5 w-16' />
              </div>
            ))}
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className='px-6 py-5 border-b bg-muted/10'>
          <Skeleton className='h-3 w-16 mb-4' />
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-16' />
            </div>
            <Separator className='my-3' />
            <div className='flex justify-between pt-1'>
              <Skeleton className='h-5 w-12' />
              <Skeleton className='h-6 w-24' />
            </div>
          </div>
        </div>

        {/* Activity Skeleton */}
        <div className='px-6 py-5'>
          <Skeleton className='h-3 w-16 mb-4' />
          <div className='flex items-start gap-3'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <div className='space-y-1.5 pt-1.5'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3 w-40' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
