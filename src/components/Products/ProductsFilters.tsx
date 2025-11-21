import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Package, LayoutGrid, Table } from 'lucide-react';

interface ProductsFiltersProps {
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

const ProductsFilters = ({ viewMode, onViewModeChange }: ProductsFiltersProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [typedSearch, setTypedSearch] = useState(search);

  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(typedSearch);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [typedSearch]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    // eslint-disable-next-line
  }, [searchParams]);

  const handleOnCreate = () => {
    navigate('/products/create');
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header with Title and Create Button */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <div className='p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm'>
            <Package className='size-6' />
          </div>
          <div>
            <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text'>
              Products Management
            </h2>
            <p className='text-sm text-muted-foreground mt-0.5'>
              Manage and monitor all your products
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {/* View Mode Toggle */}
          <div className='flex items-center gap-1 bg-muted rounded-lg p-1'>
            <Button
              type='button'
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size='sm'
              className='h-9 px-3'
              onClick={() => onViewModeChange('table')}
            >
              <Table className='size-4' />
            </Button>
            <Button
              type='button'
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size='sm'
              className='h-9 px-3'
              onClick={() => onViewModeChange('cards')}
            >
              <LayoutGrid className='size-4' />
            </Button>
          </div>
          <Button
            type='button'
            className='gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow'
            size='lg'
            onClick={handleOnCreate}
          >
            <Plus className='size-4' />
            <span className='font-semibold'>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className='bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border shadow-sm p-5'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2.5 pb-3 border-b'>
            <div className='p-1.5 rounded-md bg-primary/10'>
              <Filter className='size-4 text-primary' />
            </div>
            <span className='text-sm font-semibold text-foreground'>
              Filter Products
            </span>
          </div>
          <div className='w-full'>
            {/* Search Input */}
            <div className='relative w-full max-w-md'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3.5'>
                <Search className='size-4' />
              </div>
              <Input
                type='text'
                placeholder='Search products...'
                className='pl-10 bg-background w-full shadow-sm border-muted-foreground/20 focus-visible:border-primary/50 transition-colors h-11'
                value={typedSearch}
                onChange={(e) => setTypedSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilters;
