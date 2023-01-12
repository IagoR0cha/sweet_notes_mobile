import { createContext, ReactNode, useCallback, useContext, useState } from "react";

import { Product, ProductChanged } from "../types/Product.type";

type ProductData = {
  product: Product;
  handleChangeProduct: (productChanged: ProductChanged) => void;
}

type Props = {
  children: ReactNode;
}

export const ProductContext = createContext({} as ProductData);

function ProductProvider({ children }: Props) {
  const [product, setProduct] = useState<Product>({
    name: null,
    description: null,
    make_price: null,
    sale_price: null,
    weight: null
  } as unknown as Product)


  const handleChangeProduct = useCallback((productChanged: ProductChanged) => {
    setProduct((params) => ({ ...params, ...productChanged }));
  }, [])

  return (
    <ProductContext.Provider value={{
      product,
      handleChangeProduct
    }}>
      { children }
    </ProductContext.Provider>
  )
}

function useProductBuilder() {
  return useContext(ProductContext);
}

export {
  ProductProvider,
  useProductBuilder
}