type ProductionApi = {
  limit_value: number;
  warning_value: number;
}

type TodayProductionData = {
  current_value: number;
  limit_value: number;
  warning_value: number;
  alert_kind: AlertKind | null;
}

type  AlertKind = 'warning_massage' | 'limit_massage';

export {
  ProductionApi,
  TodayProductionData,
  AlertKind
}