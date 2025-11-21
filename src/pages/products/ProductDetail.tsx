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
    imageUrl: '',
    vendorId: '',
    imageFile: undefined,
  });

  // Track if any changes have been made
  const hasChanges = useMemo(() => {
    if (!product || !product._id) return false;

    // Check if image file was added
    if (formData.imageFile instanceof File) return true;

    // Check other fields for changes
    return (
      product.name !== formData.name ||
      product.description !== formData.description ||
      product.price !== formData.price
    );
  }, [product, formData]);

  const changes = useMemo((): ChangeDetail[] => {
    if (!product || !product._id) return [];
    const changesList: ChangeDetail[] = [];
    const fieldLabels: Record<string, string> = {
      name: 'Product Name',
      description: 'Description',
      price: 'Price',
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
    (['name', 'description', 'price'] as const).forEach((key) => {
      if (product[key] !== formData[key]) {
        let oldVal = product[key];
        let newVal = formData[key];
        if (key === 'price') {
          oldVal = `$${oldVal.toFixed(2)}`;
          newVal = `$${(newVal as number).toFixed(2)}`;
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

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | File
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
    if (product && product._id) {
      setFormData({
        ...product,
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? 0,
        imageUrl: product.imageUrl ?? '',
        vendorId: product.vendorId ?? '',
        imageFile: undefined,
      });
    }
  }, [product]);

  useEffect(() => {
    if (updatingError) {
      toast.error(updatingError);
      setShowUpdateModal(false);
    }
    if (!updating && showUpdateModal && !updatingError) {
      setShowUpdateModal(false);
      toast.success('Product updated successfully!');
    }
  }, [updating, updatingError, showUpdateModal]);

  useEffect(() => {
    if (deletingError) {
      toast.error(deletingError);
    }
    if (!deleting && showDeleteModal && !deletingError) {
      setShowDeleteModal(false);
      toast.success('Product deleted!');
      navigate('/products');
    }
  }, [deleting, deletingError, navigate, showDeleteModal]);

  const handletoggleUpdateModal = () => {
    if (!hasChanges) return;
    setShowUpdateModal((v) => !v);
  };
  const handletoggleDeleteModal = () => setShowDeleteModal((v) => !v);

  const handleUpdateProduct = async () => {
    await dispatch(updateProduct({ id: id || product._id, update: formData }));
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
      <ProductInfoCard formData={formData} onInputChange={handleInputChange} />
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
