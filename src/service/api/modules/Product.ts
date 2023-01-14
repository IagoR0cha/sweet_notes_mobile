import { APIResponse } from '../../../types/Api.type';
import { ProductApi, ProductIndexParams, ProductChanged } from '../../../types/Product.type';
import http from '../http';

export default {
  index(params?: ProductIndexParams): Promise<APIResponse<ProductApi[]>> {
    return http.get('/products', { params });
  },

  show(id: number): Promise<APIResponse<ProductApi>> {
    return http.get(`/products/${id}`);
  },

  update(product: ProductApi) {
    const { id } = product;

    return http.put(`/products/${id}`, { product });
  },

  create(product: ProductChanged): Promise<APIResponse<ProductApi>> {
    return http.post('/products', { product })
  },

  delete(id: number) {
    return http.delete(`/products/${id}`)
  }
}