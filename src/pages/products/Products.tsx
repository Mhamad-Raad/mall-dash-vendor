import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';

import ProductsFilters from '@/components/Products/ProductsFilters';
import ProductsTable from '@/components/Products/ProductsTable';
import ProductsCards from '@/components/Products/ProductsCards';
import EmptyState from '@/components/Products/EmptyState';

import { fetchProducts } from '@/store/slices/productsSlice';

const Products = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const {
    products,
    lproducts: loading,
    eproducts: error,
  } = useSelector((state: RootState) => state.products);

  const limit = parseInt(searchParams.get('limit') || '40', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchName = searchParams.get('searchName') || '';
  const inStockParam = searchParams.get('inStock');
  const inStock = inStockParam !== null ? inStockParam === 'true' : null;

  useEffect(() => {
    const params: Record<string, any> = {
      limit,
      page,
    };
    if (searchName) params.searchName = searchName;
    if (typeof inStock === 'boolean') params.inStock = inStock;

    if (limit && page) {
      dispatch(fetchProducts(params));
    }
  }, [dispatch, limit, page, searchName, inStock]);

  const hasNoProducts = !loading && products.length === 0 && !error;

  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <ProductsFilters viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Products View OR Empty State */}
      <div className='flex-1 min-h-0'>
        {hasNoProducts ? (
          <EmptyState />
        ) : viewMode === 'table' ? (
          <ProductsTable />
        ) : (
          <ProductsCards />
        )}
      </div>
    </section>
  );
};

export default Products;
