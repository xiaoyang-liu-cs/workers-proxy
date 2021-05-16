import { createResponse } from './utils';
import { FirewallOptions, FirewallFields, FirewallOperators } from './types';

class Firewall {
  firewallOptions?: FirewallOptions | FirewallOptions[];

  firewallRules: FirewallOptions[];

  constructor(
    firewallOptions?: FirewallOptions | FirewallOptions[],
  ) {
    this.firewallOptions = firewallOptions;
    this.firewallRules = [];

    if (Array.isArray(firewallOptions)) {
      this.firewallRules = firewallOptions;
    } else if (firewallOptions !== undefined) {
      this.firewallRules = [firewallOptions];
    }
  }

  getResponse = (
    request: Request,
  ): Response | null => {
    for (const { field, operator, value } of this.firewallRules) {
      const fieldParam = this.getFieldParam(
        request,
        field,
      );

      const response = this.parseFirewallRule(
        fieldParam,
        operator,
        value,
      );

      if (response !== null) {
        return response;
      }
    }
    return null;
  };

  getFieldParam = (
    request: Request,
    field: FirewallFields,
  ): string | number | null => {
    const cfProperties = request.cf;

    if (field === 'asn') {
      return cfProperties.asn;
    }

    if (field === 'continent') {
      return cfProperties.continent || '';
    }

    if (field === 'country') {
      return cfProperties.country;
    }

    if (field === 'hostname') {
      return request.headers.get('host') || '';
    }

    if (field === 'ip') {
      return request.headers.get('cf-connecting-ip') || '';
    }

    if (field === 'user-agent') {
      return request.headers.get('user-agent') || '';
    }

    return null;
  };

  parseFirewallRule = (
    fieldParam: string | number | null,
    operator: FirewallOperators,
    value: string | string[] | number | number[],
  ): Response | null => {
    if (fieldParam === null) {
      return null;
    }

    if (
      operator === 'equal'
    && fieldParam === value
    ) {
      return createResponse(
        'You don\'t have permission to access this service.',
        403,
      );
    }

    if (
      operator === 'not equal'
    && typeof fieldParam === typeof value
    && fieldParam !== value
    ) {
      return createResponse(
        'You don\'t have permission to access this service.',
        403,
      );
    }

    if (
      operator === 'greater'
    && typeof fieldParam === 'number'
    && typeof value === 'number'
    && fieldParam > value
    ) {
      return createResponse(
        'You don\'t have permission to access this service.',
        403,
      );
    }

    if (
      operator === 'less'
    && typeof fieldParam === 'number'
    && typeof value === 'number'
    && fieldParam < value
    ) {
      return createResponse(
        'You don\'t have permission to access this service.',
        403,
      );
    }

    if (Array.isArray(value)) {
      const contains = value.some(
        (item: string | number) => item === fieldParam,
      );

      if (
        (contains && operator === 'in')
        || (!contains && operator === 'not in')
      ) {
        return createResponse(
          'You don\'t have permission to access this service.',
          403,
        );
      }
    }

    if (
      operator === 'contain'
    && typeof fieldParam === 'string'
    && typeof value === 'string'
    && fieldParam.includes(value)
    ) {
      return createResponse(
        'You don\'t have permission to access this service.',
        403,
      );
    }

    if (
      operator === 'not contain'
    && typeof fieldParam === 'string'
    && typeof value === 'string'
    && fieldParam.includes(value)
    ) {
      return createResponse(
        'You don\'t have permission to access this service.',
        403,
      );
    }

    return null;
  };
}

export default Firewall;
