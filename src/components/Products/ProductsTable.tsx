import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Package as PackageIcon,
  ChevronRight,
  DollarSign,
  CheckCircle2,
  XCircle,
  Tag,
} from 'lucide-react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import ProductsTableSkeleton from './ProductsTableSkeleton';
import CustomTablePagination from '../CustomTablePagination';

import type { RootState } from '@/store/store';

const ProductsTable = () => {
  const navigate = useNavigate();

  const {
    products,
    lproducts: loading,
    eproducts: error,
    total,
  } = useSelector((state: RootState) => state.products);

  const handleRowClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (error) {
    return (
      <div className='rounded-2xl border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable table area */}
      <ScrollArea className='h-[calc(100vh-380px)] md:h-[calc(100vh-380px)]'>
        <Table className='w-full min-w-[800px]'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b-2 bg-muted/30'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground bg-muted/30 backdrop-blur-sm border-b h-14 pl-6'>
                Product
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground bg-muted/30 backdrop-blur-sm border-b h-14'>
                Category
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground bg-muted/30 backdrop-blur-sm border-b h-14'>
                Status
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground bg-muted/30 backdrop-blur-sm border-b h-14'>
                Price
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-16 bg-muted/30 backdrop-blur-sm border-b h-14'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <ProductsTableSkeleton key={`skeleton-${index}`} />
                ))
              : products.map((product, index) => {
                  const productImage = product.productImageUrl;
                  const isInStock = product.inStock !== false;
                  const hasDiscount =
                    product.discountPrice && product.discountPrice < product.price;

                  return (
                    <TableRow
                      key={`${product?.id}-${index}`}
                      className='group hover:bg-primary/5 transition-all duration-200 cursor-pointer border-b last:border-0'
                      onClick={() => handleRowClick(String(product?.id))}
                    >
                      {/* Product Info with Image */}
                      <TableCell className='font-medium py-4 pl-6'>
                        <div className='flex items-center gap-4'>
                          <div className='relative h-16 w-16 rounded-xl overflow-hidden border-2 border-border/50 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/50 group-hover:scale-105 shrink-0'>
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={product.name}
                                className='h-full w-full object-cover'
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    'none';
                                  const parent = (e.target as HTMLImageElement)
                                    .parentElement;
                                  if (parent) {
                                    const fallback =
                                      document.createElement('div');
                                    fallback.className =
                                      'h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 text-primary';
                                    fallback.innerHTML =
                                      '<svg class="h-8 w-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 text-primary'>
                                <PackageIcon className='h-8 w-8 opacity-60' />
                              </div>
                            )}
                            {hasDiscount && (
                              <div className='absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow'>
                                SALE
                              </div>
                            )}
                          </div>
                          <div className='flex flex-col gap-1'>
                            <span className='font-semibold text-sm leading-tight group-hover:text-primary transition-colors'>
                              {product.name}
                            </span>
                            <span className='text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded w-fit'>
                              #{product?.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className='py-4'>
                        {product.categoryName ? (
                          <Badge
                            variant='secondary'
                            className='text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border-0 px-3 py-1'
                          >
                            {product.categoryName}
                          </Badge>
                        ) : (
                          <span className='text-xs text-muted-foreground'>—</span>
                        )}
                      </TableCell>

                      {/* Stock Status */}
                      <TableCell className='py-4'>
                        <Badge
                          variant={isInStock ? 'default' : 'destructive'}
                          className={`gap-1.5 ${
                            isInStock
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30'
                              : 'bg-destructive/15 hover:bg-destructive/25 border-destructive/30'
                          }`}
                        >
                          {isInStock ? (
                            <CheckCircle2 className='size-3' />
                          ) : (
                            <XCircle className='size-3' />
                          )}
                          {isInStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell className='py-4'>
                        <div className='flex flex-col gap-0.5'>
                          <div className='flex items-center gap-1'>
                            <DollarSign className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                            <span className='text-base font-bold text-foreground'>
                              {hasDiscount
                                ? product.discountPrice?.toFixed(2)
                                : product.price.toFixed(2)}
                            </span>
                          </div>
                          {hasDiscount && (
                            <div className='flex items-center gap-1.5'>
                              <span className='text-xs text-muted-foreground line-through'>
                                ${product.price.toFixed(2)}
                              </span>
                              <Badge
                                variant='secondary'
                                className='text-[9px] h-4 px-1 bg-amber-500/15 text-amber-700 dark:text-amber-400'
                              >
                                <Tag className='size-2 mr-0.5' />
                                {Math.round(
                                  ((product.price - (product.discountPrice || 0)) /
                                    product.price) *
                                    100
                                )}
                                % OFF
                              </Badge>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Chevron indicator */}
                      <TableCell className='py-4 w-16 pr-6'>
                        <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300'>
                          <ChevronRight className='h-4 w-4 group-hover:translate-x-0.5 transition-transform' />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {/* Pagination */}
      <div className='border-t px-6 py-3 bg-background'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 40, 50, 100]}
        />
      </div>
    </div>
  );
};

export default ProductsTable;
