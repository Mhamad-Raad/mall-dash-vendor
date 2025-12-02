import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Package, Upload, X } from 'lucide-react';
import type { ProductFormData } from '@/interfaces/Products.interface';
import type { CategoryDTO } from '@/data/Categories';

interface ProductInfoCardProps {
  formData: ProductFormData;
  categories?: CategoryDTO[];
  onInputChange: (
    field: keyof ProductFormData,
    value: string | number | File | boolean
  ) => void;
}

export default function ProductInfoCard({
  formData,
  categories = [],
  onInputChange,
}: ProductInfoCardProps) {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onInputChange('imageFile', file);
    }
  };

  const handleRemovePhoto = () => {
    onInputChange('imageFile', null as any);
    onInputChange('imageUrl', '');
  };

  const previewUrl = formData.imageFile
    ? URL.createObjectURL(formData.imageFile)
    : formData.imageUrl || formData.src;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>
          Update the product's basic information
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Product Photo */}
        <div className='space-y-2'>
          <Label>Product Photo</Label>
          <div className='flex items-center gap-4'>
            <Avatar className='h-32 w-32 rounded-lg'>
              <AvatarImage src={previewUrl} className='object-cover' />
              <AvatarFallback className='rounded-lg bg-muted'>
                <Package className='h-14 w-14 text-muted-foreground' />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='gap-2'
                onClick={() =>
                  document.getElementById('photo-upload-edit')?.click()
                }
              >
                <Upload className='size-4' />
                Upload Photo
              </Button>
              {previewUrl && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='gap-2'
                  onClick={handleRemovePhoto}
                >
                  <X className='size-4' />
                  Remove
                </Button>
              )}
              <input
                id='photo-upload-edit'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handlePhotoChange}
              />
            </div>
          </div>
          {/* Optional Image URL */}
          <div className='space-y-2'>
            <Label htmlFor='imageUrl'>Image URL (optional)</Label>
            <Input
              id='imageUrl'
              placeholder='https://...'
              value={formData.imageUrl}
              onChange={(e) => onInputChange('imageUrl', e.target.value)}
            />
          </div>
        </div>

        {/* Product Name */}
        <div className='space-y-2'>
          <Label htmlFor='name'>Product Name</Label>
          <Input
            id='name'
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder='Enter product name'
          />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder='Enter product description'
            rows={5}
          />
        </div>

        {/* Price */}
        <div className='space-y-2'>
          <Label htmlFor='price'>Price (USD)</Label>
          <Input
            id='price'
            type='number'
            step='0.01'
            min='0'
            value={formData.price}
            onChange={(e) =>
              onInputChange('price', parseFloat(e.target.value) || 0)
            }
            placeholder='0.00'
          />
        </div>

        {/* Discount Price */}
        <div className='space-y-2'>
          <Label htmlFor='discountPrice'>Discount Price (USD)</Label>
          <Input
            id='discountPrice'
            type='number'
            step='0.01'
            min='0'
            value={formData.discountPrice ?? 0}
            onChange={(e) =>
              onInputChange('discountPrice', parseFloat(e.target.value) || 0)
            }
            placeholder='0.00'
          />
        </div>

        {/* Category */}
        <div className='space-y-2'>
          <Label htmlFor='category'>Category</Label>
          <select
            id='category'
            className='h-11 w-full border rounded px-3 bg-background'
            value={String(formData.categoryId ?? '')}
            onChange={(e) =>
              onInputChange('categoryId', parseInt(e.target.value, 10))
            }
          >
            <option value=''>Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
          {formData.categoryName && (
            <p className='text-xs text-muted-foreground'>
              Current: {formData.categoryName}
            </p>
          )}
        </div>

        {/* Flags */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex items-center justify-between rounded-lg border p-3'>
            <div className='space-y-0.5'>
              <Label>In Stock</Label>
              <p className='text-xs text-muted-foreground'>
                Is this product currently in stock?
              </p>
            </div>
            <input
              type='checkbox'
              className='size-5'
              checked={Boolean(formData.inStock)}
              onChange={(e) => onInputChange('inStock', e.target.checked)}
            />
          </div>
          <div className='flex items-center justify-between rounded-lg border p-3'>
            <div className='space-y-0.5'>
              <Label>Weightable</Label>
              <p className='text-xs text-muted-foreground'>
                Sold by weight (e.g., kg)?
              </p>
            </div>
            <input
              type='checkbox'
              className='size-5'
              checked={Boolean(formData.isWeightable)}
              onChange={(e) => onInputChange('isWeightable', e.target.checked)}
            />
          </div>
        </div>

        {/* Vendor name (read-only) */}
        {formData.vendorName && (
          <div className='space-y-1'>
            <Label>Vendor</Label>
            <p className='text-sm text-muted-foreground'>
              {formData.vendorName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

