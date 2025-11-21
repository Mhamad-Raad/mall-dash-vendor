import { Package } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full text-center p-8'>
      <Package className='w-12 h-12 text-muted-foreground mb-4' />
      <h2 className='text-xl font-semibold mb-2'>No products found</h2>
      <p className='text-muted-foreground mb-4'>
        Try adjusting your filters or create a new product.
      </p>
    </div>
  );
};

export default EmptyState;
