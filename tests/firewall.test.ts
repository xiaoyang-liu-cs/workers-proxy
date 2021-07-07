import {
  getFieldParam,
  parseFirewallRule,
  useFirewall
} from '../src/firewall';

import { Context } from '../types/middleware';

import {
  FirewallOptions,
  FirewallFields,
  FirewallOperators,
} from '../types/firewall';

const request = new Request(
  'https://httpbin.org/get',
  {
    headers: new Headers({
      host: 'https://httpbin.org',
      'cf-connecting-ip': '1.1.1.1',
      'X-Forwarded-For': '127.0.0.1, 127.0.0.2',
    }),
    method: 'GET',
  },
);

test('firewall.ts -> getFieldParam()', () => {
  const firewall = [
    {
      field: 'ip' as FirewallFields,
      operator: 'equal',
      value: '',
    },
    {
      field: 'hostname' as FirewallFields,
      operator: 'equal',
      value: '',
    },
  ]
  expect(getFieldParam(request, firewall[0].field)).toEqual('1.1.1.1');
  expect(getFieldParam(request, firewall[1].field)).toEqual('https://httpbin.org');
});

test('firewall.ts -> parseFirewallRule()', () => {
  const firewall = [
    {
      field: 'ip' as FirewallFields,
      operator: 'equal' as FirewallOperators,
      value: '1.1.1.1',
    },
    {
      field: 'hostname' as FirewallFields,
      operator: 'equal' as FirewallOperators,
      value: '',
    },
  ]
  const response1 = parseFirewallRule(
    (getFieldParam(request, firewall[0].field)),
    firewall[0].operator,
    firewall[0].value,
  );
  const response2 = parseFirewallRule(
    (getFieldParam(request, firewall[1].field)),
    firewall[1].operator,
    firewall[1].value,
  );
  expect(response1 !== null);
  expect(response2 === null);
});

test('firewall.ts -> useFirewall()', () => {
  const firewall : FirewallOptions[] = [
    {
      field: 'ip' as FirewallFields,
      operator: 'match' as FirewallOperators,
      value: new RegExp('^1'),
    },
  ]
  const context: Context = {
    request: request,
    response: new Response(),
    hostname: 'https://httpbin.org',
    upstream: null,
    options: {
      upstream: {
        domain: 'httpbin.org',
      },
      header: {
        request: {
          'X-Test': 'Test header',
          'X-Forwarded-For': 'Test override',
        },
      },
      firewall: firewall
    },
  };
  useFirewall(context, () => null);
  expect(context.response.status !== 200);
});

test('firewall.ts -> useFirewall()', () => {
  const firewall : FirewallOptions[] = [
    {
      field: 'ip' as FirewallFields,
      operator: 'match' as FirewallOperators,
      value: new RegExp('^1'),
    },
  ]
  const context: Context = {
    request: new Request(
      'https://httpbin.org/get',
      {
        headers: new Headers({
          host: 'https://httpbin.org',
          'cf-connecting-ip': '255.1.1.1',
          'X-Forwarded-For': '127.0.0.1, 127.0.0.2',
        }),
        method: 'GET',
      },
    ),
    response: new Response(),
    hostname: 'https://httpbin.org',
    upstream: null,
    options: {
      upstream: {
        domain: 'httpbin.org',
      },
      header: {
        request: {
          'X-Test': 'Test header',
          'X-Forwarded-For': 'Test override',
        },
      },
      firewall: firewall
    },
  };
  useFirewall(context, () => null);
  expect(context.response.status === 200);
});
