import { APIResponse } from '../../../types/Api.type';
import { OrderData } from '../../../types/Dashboard.type';
import { TodayProductionData } from '../../../types/Production.type';
import http from '../http';

export default {
  production(): Promise<APIResponse<TodayProductionData>> {
    return http.get('/dashboard/production');
  },

  orderData(): Promise<APIResponse<OrderData>> {
    return http.get('/dashboard/order_data');
  }
}