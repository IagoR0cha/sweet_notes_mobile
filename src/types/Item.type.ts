type ItemApi = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  observation?: string;
}

type ItemCreate = Omit<ItemApi, 'id' | 'order_id'> & {
  id?: number;
  order_id?: number;
  product_name: string;
}

type Item = (ItemCreate & {
  _destroy?: boolean;
}) | { id: number, _destroy: true }


type ItemChanged = Partial<Item>;

export {
  Item,
  ItemApi,
  ItemChanged,
  ItemCreate
}