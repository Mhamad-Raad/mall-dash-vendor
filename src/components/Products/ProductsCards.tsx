import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Package as PackageIcon, DollarSign } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';

import ProductsCardsSkeleton from './ProductsCardsSkeleton';
import CustomTablePagination from '../CustomTablePagination';

import type { RootState } from '@/store/store';

const ProductsCards = () => {
  const navigate = useNavigate();

  const {
    products,
    lproducts: loading,
    eproducts: error,
    total,
  } = useSelector((state: RootState) => state.products);

  const handleCardClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable cards area */}
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
        <div className='p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ProductsCardsSkeleton key={`skeleton-${index}`} />
              ))
            : products.map((product) => {
                const productImage = product.imageUrl || product.src;

                return (
                  <div
                    key={product._id}
                    className='group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:border-primary/50'
                    onClick={() => handleCardClick(product._id)}
                  >
                    {/* Product Image */}
                    <div className='relative h-48 w-full overflow-hidden bg-muted'>
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className='h-full w-full object-cover transition-transform group-hover:scale-105'
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 text-primary';
                              fallback.innerHTML = '<svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 text-primary'>
                          <PackageIcon className='h-16 w-16' />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className='p-4 flex flex-col gap-3'>
                      {/* Product Name */}
                      <div className='flex flex-col gap-1'>
                        <h3 className='font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1'>
                          {product.name}
                        </h3>
                        <span className='text-[10px] text-muted-foreground font-mono'>
                          ID: {product._id.slice(-8)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className='text-xs text-muted-foreground line-clamp-3 min-h-[3rem]'>
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className='flex items-center justify-between pt-2 border-t'>
                        <div className='flex items-center gap-1'>
                          <DollarSign className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                          <span className='text-xl font-bold text-foreground'>
                            {product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className='border-t px-4 py-3 bg-muted/20'>
        <CustomTablePagination
          total={total}
          suggestions={[8, 12, 20, 40]}
        />
      </div>
    </div>
  );
};

export default ProductsCards;
