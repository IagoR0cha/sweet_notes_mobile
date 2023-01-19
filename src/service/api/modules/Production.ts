import { APIResponse } from '../../../types/Api.type';
import { ProductionApi } from '../../../types/Production.type';
import http from '../http';

export default {
  show(): Promise<APIResponse<ProductionApi>> {
    return http.get('/production');
  },

  update(productionChanged: Partial<ProductionApi>): Promise<APIResponse<ProductionApi>> {
    return http.put('/production', { production: productionChanged });
  }
}