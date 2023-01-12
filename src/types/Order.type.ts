import { Item } from './Item.type';

type  OrderApi = {
  id: number;
  description: string;
  status: StatusOrder;
  client: string;
  order_date: Date;
  items: (Item & { product_name: string })[];
}

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

export {
  OrderApi,
  StatusOrder,
  OrderIndexParams,
  Order,
  OrderChanged,
  CreateOrder
}