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

interface ProductInfoCardProps {
  formData: ProductFormData;
  onInputChange: (field: keyof ProductFormData, value: string | number | File) => void;
}

export default function ProductInfoCard({
  formData,
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
                onClick={() => document.getElementById('photo-upload-edit')?.click()}
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
            onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
            placeholder='0.00'
          />
        </div>
      </CardContent>
    </Card>
  );
}
