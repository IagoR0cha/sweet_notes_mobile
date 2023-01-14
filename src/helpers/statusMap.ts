import { StatusPillKind } from "../componentes/_shared/DefaultPill"
import { StatusOrder } from "../types/Order.type"

type StatusMap = {
  [key in StatusOrder]: {
    label: string;
    status: StatusPillKind;
  };
}
export const statusMap: StatusMap = {
  open: { label: 'Aberto', status: 'success' },
  close: { label: 'Fechado', status: 'error' },
  pending_payment: { label: 'Aguardando sinal', status: 'warning' },
}