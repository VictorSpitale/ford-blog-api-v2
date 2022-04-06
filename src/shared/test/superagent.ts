import * as defaults from 'superagent-defaults';

export function getRequest(request, header = null) {
  const requestAgent = defaults(request);
  if (header) requestAgent.set(header);
  return requestAgent;
}
