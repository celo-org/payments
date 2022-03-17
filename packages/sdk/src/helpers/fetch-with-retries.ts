import fetch from 'isomorphic-fetch';

export async function fetchWithRetries(
  info: RequestInfo,
  init?: RequestInit,
  retries = 3,
): Promise<Response> {
  let lastResponse = null;
  for (let i = 0; i < retries; i++) {
    const response = await fetch(info, init);
    if (response.status >= 500) {
      lastResponse = response;
    } else {
      return response;
    }
  }

  return lastResponse;
}
