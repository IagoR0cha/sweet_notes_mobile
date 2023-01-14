type DashboardProduction = {
  current_value: number;
  limit_value: number;
}

type OrderData = {
  opened_orders_count: number;
  closed_orders_count: number;
  pending_payment_orders_count: number;
}

export {
  DashboardProduction,
  OrderData
}