import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailSkeleton() {
  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header Skeleton */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-md' />
          <div className='space-y-2'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-4 w-64' />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-10 w-24' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>

      {/* Product Info Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-64' />
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Photo */}
          <div className='flex items-center gap-4'>
            <Skeleton className='h-32 w-32 rounded-lg' />
            <div className='space-y-2'>
              <Skeleton className='h-9 w-32' />
              <Skeleton className='h-9 w-24' />
            </div>
          </div>
          {/* Name */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-10 w-full' />
          </div>
          {/* Description */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-24 w-full' />
          </div>
          {/* Price */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-10 w-32' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
