export interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  vendorId: string;
  // Helper fields for UI
  src?: string; // Alias for imageUrl (for backward compatibility)
}

// Extended type for form data with optional image file
export interface ProductFormData extends ProductType {
  imageFile?: File;
}

export interface ProductsType {
  products: ProductType[];
}
