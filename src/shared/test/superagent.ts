import * as defaults from 'superagent-defaults';

export function getRequest(request, header) {
  const requestAgent = defaults(request);
  requestAgent.set(header);
  return requestAgent;
}
