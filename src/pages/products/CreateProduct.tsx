import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Package, ArrowLeft, Save, Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { createProduct } from '@/data/Products';
import { fetchCategories, type CategoryDTO } from '@/data/Categories';

export default function CreateProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorId: '',
    categoryId: '',
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    inStock: true,
    isWeightable: false,
    photo: null as File | null,
    imageUrl: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    const run = async () => {
      const res = await fetchCategories();
      if ((res as any)?.error) {
        toast.error('Failed to load categories');
      } else {
        setCategories(res as CategoryDTO[]);
      }
    };
    run();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPreviewUrl(null);
  };

  const handleBack = () => {
    navigate('/products');
  };

  const handleCreateProduct = async () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.vendorId) {
      toast.error('Please enter Vendor ID');
      return;
    }

    setLoading(true);

    const payload = {
      VendorId: parseInt(formData.vendorId, 10),
      CategoryId: parseInt(formData.categoryId, 10),
      Name: formData.name,
      Description: formData.description,
      Price: parseFloat(formData.price),
      ...(formData.discountPrice ? { DiscountPrice: parseFloat(formData.discountPrice) } : {}),
      InStock: Boolean(formData.inStock),
      IsWeightable: Boolean(formData.isWeightable),
      ...(formData.photo
        ? { ProductImageUrl: formData.photo }
        : formData.imageUrl
        ? { ProductImageUrl: formData.imageUrl }
        : {}),
    };

    const res = await createProduct(payload);

    setLoading(false);

    if ((res as any)?.error) {
      toast.error('Failed to Create Product', {
        description: (res as any).error || 'An error occurred while creating the product.',
      });
    } else {
      toast.success('Product Created Successfully!', {
        description: `${formData.name} has been added to the system.`,
      });
      navigate('/products');
    }
  };

  return (
    <div className='w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] h-full flex flex-col -m-4 md:-m-6'>
      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24'>
        {/* Header */}
        <div className='flex items-center gap-3 sm:gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={handleBack}
            className='h-10 w-10 shrink-0'
          >
            <ArrowLeft className='size-4' />
          </Button>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='p-2 rounded-lg bg-primary/10 text-primary shrink-0'>
              <Package className='size-5' />
            </div>
            <div className='min-w-0'>
              <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>
                Create New Product
              </h1>
              <p className='text-xs sm:text-sm text-muted-foreground'>
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Product Information</CardTitle>
            <CardDescription>
              Fill in the details for the new product
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Product Photo */}
            <div className='space-y-2'>
              <Label>Product Photo</Label>
              <div className='flex items-center gap-4'>
                <Avatar className='h-24 w-24 rounded-lg'>
                  <AvatarImage src={previewUrl || ''} className='object-cover' />
                  <AvatarFallback className='rounded-lg bg-muted'>
                    <Package className='h-10 w-10 text-muted-foreground' />
                  </AvatarFallback>
                </Avatar>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='gap-2'
                    onClick={() => document.getElementById('photo-upload')?.click()}
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
                    id='photo-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='imageUrl'>Image URL (optional)</Label>
                <Input
                  id='imageUrl'
                  placeholder='https://...'
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                />
              </div>
            </div>

            {/* Product Name */}
            <div className='space-y-2'>
              <Label htmlFor='name'>Product Name *</Label>
              <Input
                id='name'
                placeholder='Enter product name'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
                placeholder='Enter product description'
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            {/* Category */}
            <div className='space-y-2'>
              <Label htmlFor='category'>Category *</Label>
              <select
                id='category'
                className='h-11 w-full border rounded px-3 bg-background'
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
              >
                <option value=''>Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor ID */}
            <div className='space-y-2'>
              <Label htmlFor='vendorId'>Vendor ID *</Label>
              <Input
                id='vendorId'
                type='number'
                min='1'
                placeholder='Enter vendor ID'
                value={formData.vendorId}
                onChange={(e) => handleInputChange('vendorId', e.target.value)}
              />
            </div>

            {/* Price */}
            <div className='space-y-2'>
              <Label htmlFor='price'>Price (USD) *</Label>
              <Input
                id='price'
                type='number'
                step='0.01'
                min='0'
                placeholder='0.00'
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
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
                placeholder='0.00'
                value={formData.discountPrice}
                onChange={(e) => handleInputChange('discountPrice', e.target.value)}
              />
            </div>

            {/* Flags */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div className='space-y-0.5'>
                  <Label>In Stock</Label>
                  <p className='text-xs text-muted-foreground'>Is this product currently in stock?</p>
                </div>
                <input
                  type='checkbox'
                  className='size-5'
                  checked={formData.inStock}
                  onChange={(e) => handleInputChange('inStock', e.target.checked)}
                />
              </div>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div className='space-y-0.5'>
                  <Label>Weightable</Label>
                  <p className='text-xs text-muted-foreground'>Sold by weight (e.g., kg)?</p>
                </div>
                <input
                  type='checkbox'
                  className='size-5'
                  checked={formData.isWeightable}
                  onChange={(e) => handleInputChange('isWeightable', e.target.checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Footer with Action Buttons */}
      <div className='sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 md:px-6'>
        <div className='flex gap-2 justify-end'>
          <Button variant='outline' onClick={handleBack} className='gap-2'>
            Cancel
          </Button>
          <Button
            className='gap-2'
            onClick={handleCreateProduct}
            disabled={loading}
          >
            <Save className='size-4' />
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}
