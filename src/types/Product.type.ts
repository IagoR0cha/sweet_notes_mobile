type ProductApi = {
  id: number;
  name: string;
  make_price: number;
  sale_price: number;
  weight: number;
  description?: string;
}

type Product = Omit<ProductApi, 'id'> & {
  id?: number;
}

type ProductChanged = {
  [key in keyof Product]?: Product[key]
}

type ProductIndexParams = any;

export {
  ProductApi,
  ProductIndexParams,
  Product,
  ProductChanged
}