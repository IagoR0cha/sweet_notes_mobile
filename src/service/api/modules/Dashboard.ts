import { APIResponse } from '../../../types/Api.type';
import { DashboardProduction, OrderData } from '../../../types/Dashboard.type';
import http from '../http';

export default {
  production(): Promise<APIResponse<DashboardProduction>> {
    return http.get('/dashboard/production');
  },

  orderData(): Promise<APIResponse<OrderData>> {
    return http.get('/dashboard/order_data');
  }
}