import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetailHeader from '@/components/Products/ProductDetail/ProductDetailHeader';
import ProductInfoCard from '@/components/Products/ProductDetail/ProductInfoCard';
import ProductDetailSkeleton from '@/components/Products/ProductDetail/ProductDetailSkeleton';
import ProductErrorCard from '@/components/Products/ProductDetail/ProductErrorCard';
import ConfirmModal, {
  type ChangeDetail,
} from '@/components/ui/Modals/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchProductById,
  clearProduct,
  updateProduct,
  deleteProduct,
} from '@/store/slices/productSlice';
import { toast } from 'sonner';
import { fetchCategories, type CategoryDTO } from '@/data/Categories';

import type { ProductFormData } from '@/interfaces/Products.interface';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    product,
    lproduct: loading,
    eproduct: error,
    updating,
    updatingError,
    deleting,
    deletingError,
  } = useSelector((state: RootState) => state.product);

  const [formData, setFormData] = useState<ProductFormData>({
    _id: '',
    name: '',
    description: '',
    price: 0,
    discountPrice: null,
    inStock: false,
    isWeightable: false,
    imageUrl: '',
    vendorId: '',
    vendorName: '',
    categoryId: undefined,
    categoryName: '',
    imageFile: undefined,
  });
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  // Track if any changes have been made
  const hasChanges = useMemo(() => {
    if (!product || !product._id) return false;

    // Check if image file was added
    if (formData.imageFile instanceof File) return true;

    // Check other fields for changes
    return (
      product.name !== formData.name ||
      product.description !== formData.description ||
      product.price !== formData.price ||
      (typeof product.discountPrice === 'number'
        ? product.discountPrice
        : null) !==
        (typeof formData.discountPrice === 'number'
          ? formData.discountPrice
          : null) ||
      Boolean(product.inStock) !== Boolean(formData.inStock) ||
      Boolean(product.isWeightable) !== Boolean(formData.isWeightable) ||
      (product.categoryId ?? null) !== (formData.categoryId ?? null) ||
      (product.imageUrl ?? '') !== (formData.imageUrl ?? '')
    );
  }, [product, formData]);

  const changes = useMemo((): ChangeDetail[] => {
    if (!product || !product._id) return [];
    const changesList: ChangeDetail[] = [];
    const fieldLabels: Record<string, string> = {
      name: 'Product Name',
      description: 'Description',
      price: 'Price',
      discountPrice: 'Discount Price',
      inStock: 'In Stock',
      isWeightable: 'Weightable',
      categoryId: 'Category',
      imageUrl: 'Image URL',
    };

    // Check for image change
    if (formData.imageFile instanceof File) {
      changesList.push({
        field: 'Product Image',
        oldValue: product.imageUrl ? 'Current image' : 'No image',
        newValue: formData.imageFile.name,
      });
    }

    // Check other fields
    (
      [
        'name',
        'description',
        'price',
        'discountPrice',
        'inStock',
        'isWeightable',
        'categoryId',
        'imageUrl',
      ] as const
    ).forEach((key) => {
      if (product[key] !== formData[key]) {
        let oldVal = product[key];
        let newVal = formData[key];
        if (key === 'price') {
          const oldNum =
            typeof oldVal === 'number' ? oldVal : Number(oldVal ?? 0);
          const newNum =
            typeof newVal === 'number' ? newVal : Number(newVal ?? 0);
          oldVal = `$${oldNum.toFixed(2)}`;
          newVal = `$${newNum.toFixed(2)}`;
        } else if (key === 'discountPrice') {
          const oldNum =
            oldVal == null
              ? null
              : typeof oldVal === 'number'
              ? oldVal
              : Number(oldVal);
          const newNum =
            newVal == null
              ? null
              : typeof newVal === 'number'
              ? newVal
              : Number(newVal);
          oldVal = oldNum == null ? '—' : `$${oldNum.toFixed(2)}`;
          newVal = newNum == null ? '—' : `$${newNum.toFixed(2)}`;
        } else if (key === 'inStock' || key === 'isWeightable') {
          oldVal = Boolean(oldVal) ? 'Yes' : 'No';
          newVal = Boolean(newVal) ? 'Yes' : 'No';
        } else if (key === 'categoryId') {
          oldVal = product.categoryName ?? String(oldVal ?? '');
          newVal = String(newVal ?? '');
        }
        changesList.push({
          field: fieldLabels[key],
          oldValue: String(oldVal ?? ''),
          newValue: String(newVal ?? ''),
        });
      }
    });
    return changesList;
  }, [product, formData]);

  const deleteSummary = useMemo((): ChangeDetail[] => {
    if (!product || !product._id) return [];
    return [
      { field: 'Product Name', oldValue: product.name ?? '', newValue: '—' },
      {
        field: 'Description',
        oldValue: product.description ?? '',
        newValue: '—',
      },
      {
        field: 'Price',
        oldValue: `$${(product.price ?? 0).toFixed(2)}`,
        newValue: '—',
      },
      {
        field: 'Discount Price',
        oldValue:
          product.discountPrice == null
            ? '—'
            : `$${product.discountPrice.toFixed(2)}`,
        newValue: '—',
      },
      {
        field: 'Category',
        oldValue: product.categoryName ?? String(product.categoryId ?? ''),
        newValue: '—',
      },
      {
        field: 'In Stock',
        oldValue: product.inStock ? 'Yes' : 'No',
        newValue: '—',
      },
      {
        field: 'Weightable',
        oldValue: product.isWeightable ? 'Yes' : 'No',
        newValue: '—',
      },
    ];
  }, [product]);

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | File | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearProduct());
    };
  }, [id, dispatch]);

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

  useEffect(() => {
    if (product && product._id) {
      setFormData({
        ...product,
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? 0,
        discountPrice: product.discountPrice ?? null,
        inStock: Boolean(product.inStock),
        isWeightable: Boolean(product.isWeightable),
        imageUrl: product.imageUrl ?? '',
        vendorId: product.vendorId ?? '',
        vendorName: product.vendorName ?? '',
        categoryId: product.categoryId,
        categoryName: product.categoryName ?? '',
        imageFile: undefined,
      });
    }
  }, [product]);

  useEffect(() => {
    if (updatingError) {
      toast.error(updatingError);
    }
  }, [updatingError]);

  useEffect(() => {
    if (deletingError) {
      toast.error(deletingError);
    }
    if (!deleting && showDeleteModal && !deletingError) {
      setShowDeleteModal(false);
      toast.success('Product deleted!');
      navigate('/products');
    }
  }, [deleting, deletingError, navigate]);

  const handletoggleUpdateModal = () => {
    if (!hasChanges) return;
    setShowUpdateModal((v) => !v);
  };
  const handletoggleDeleteModal = () => setShowDeleteModal((v) => !v);

  const handleUpdateProduct = async () => {
    if (!hasChanges) return;
    const updatePayload = {
      CategoryId: formData.categoryId ?? 0,
      Name: formData.name,
      Description: formData.description,
      Price: Number(formData.price),
      DiscountPrice:
        typeof formData.discountPrice === 'number'
          ? formData.discountPrice
          : undefined,
      InStock: Boolean(formData.inStock),
      IsWeightable: Boolean(formData.isWeightable),
      imageFile: formData.imageFile,
      ProductImageUrl:
        !formData.imageFile && formData.imageUrl
          ? formData.imageUrl
          : undefined,
    };
    try {
      await dispatch(
        updateProduct({ id: id || product._id, update: updatePayload })
      ).unwrap();
      setShowUpdateModal(false);
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async () => {
    await dispatch(deleteProduct(id || product._id));
  };

  if (error) return <ProductErrorCard error={error} />;
  if (loading) return <ProductDetailSkeleton />;

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <ProductDetailHeader
        onBack={() => navigate(-1)}
        onSave={handletoggleUpdateModal}
        onDelete={handletoggleDeleteModal}
        hasChanges={hasChanges}
      />
      <ProductInfoCard
        formData={formData}
        categories={categories}
        onInputChange={handleInputChange}
      />
      <ConfirmModal
        open={showUpdateModal}
        title='Update Product'
        description='Are you sure you want to update this product?'
        userName={product.name}
        confirmType='warning'
        confirmLabel='Update'
        cancelLabel='Cancel'
        onCancel={handletoggleUpdateModal}
        onConfirm={handleUpdateProduct}
        changes={changes}
      />
      <ConfirmModal
        open={showDeleteModal}
        title='Delete Product'
        description='Are you sure you want to delete this product?'
        userName={product.name}
        warning='WARNING! This action cannot be undone.'
        confirmType='danger'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        onCancel={handletoggleDeleteModal}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductDetail;

