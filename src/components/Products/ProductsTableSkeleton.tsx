import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const ProductsTableSkeleton = () => (
  <TableRow className='border-b'>
    {/* Product Info Skeleton - matches Image + Name + ID */}
    <TableCell className='font-medium py-4'>
      <div className='flex items-center gap-3 h-16'>
        <Skeleton className='h-16 w-16 rounded-lg shrink-0 border-2 border-transparent' />
        <div className='flex flex-col gap-1 justify-center'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-24' />
        </div>
      </div>
    </TableCell>

    {/* Description Skeleton */}
    <TableCell className='py-4'>
      <div className='flex flex-col gap-1.5 min-w-[200px]'>
        <Skeleton className='h-3.5 w-full' />
        <Skeleton className='h-3.5 w-3/4' />
      </div>
    </TableCell>

    {/* Price Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-6 w-20 rounded-md' />
    </TableCell>

    {/* ChevronRight Skeleton */}
    <TableCell className='py-4 w-12'>
      <Skeleton className='h-4 w-4 rounded' />
    </TableCell>
  </TableRow>
);

export default ProductsTableSkeleton;
