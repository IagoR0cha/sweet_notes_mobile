import { Item, ItemApi } from './Item.type';
import { TodayProductionData } from './Production.type';

type OrderApi = {
  id: number;
  description: string;
  status: StatusOrder;
  client: string;
  order_date: Date;
  items: OrderItem[];
}

type OrderItem = (ItemApi & { product_name: string });

type Order = Omit<OrderApi, 'id'> & {
  id?: number;
}

type OrderChanged = {
  [key in keyof Order]?: Order[key]
}

type CreateOrder = Order & {
  itemizations_attributes: Item[]
}

type StatusOrder = 'open' | 'close' | 'pending_payment';

type OrderIndexParams = {
  start_at?: Date;
  final_at?: Date;
  client?: string;
  status?: StatusOrder[];
}

type CreateResponse = {
  order: OrderApi;
  production: TodayProductionData;
}

export {
  OrderApi,
  StatusOrder,
  OrderIndexParams,
  Order,
  OrderChanged,
  CreateOrder,
  OrderItem,
  CreateResponse
}