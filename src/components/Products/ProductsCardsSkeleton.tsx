import { Skeleton } from '@/components/ui/skeleton';

const ProductsCardsSkeleton = () => (
  <div className='bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
    {/* Image Skeleton */}
    <Skeleton className='w-full h-48' />

    {/* Content */}
    <div className='p-4 flex flex-col gap-3'>
      {/* Title */}
      <Skeleton className='h-5 w-3/4' />

      {/* Description */}
      <div className='flex flex-col gap-1.5'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-4/5' />
      </div>

      {/* Category Badge */}
      <Skeleton className='h-6 w-20 rounded-full' />

      {/* Price and Stock */}
      <div className='flex items-center justify-between pt-2 border-t'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='h-5 w-16' />
      </div>
    </div>
  </div>
);

export default ProductsCardsSkeleton;
