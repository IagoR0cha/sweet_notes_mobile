import { APIResponse } from '../../../types/Api.type';
import { OrderApi, OrderIndexParams, OrderChanged, CreateOrder, CreateResponse } from '../../../types/Order.type';
import http from '../http';

export default {
  index(params?: OrderIndexParams): Promise<APIResponse<OrderApi[]>> {
    return http.get('/orders', { params });
  },

  show(id: number): Promise<APIResponse<OrderApi>> {
    return http.get(`/orders/${id}`);
  },

  create(order: CreateOrder): Promise<APIResponse<CreateResponse>> {
    return http.post('/orders', { order })
  },

  update(orderUpdated: OrderChanged): Promise<APIResponse<OrderApi>> {
    const { id } = orderUpdated;
    return http.put(`/orders/${id}`, { order: orderUpdated })
  },

  delete(id: number) {
    return http.delete(`/orders/${id}`)
  }
}