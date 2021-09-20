import { URL, URLSearchParams } from 'url';

export interface DeepLink {
  apiBase: string;
  referenceId: string;
}

function searchParamsToObject(sp: URLSearchParams): Record<string, string> {
  const obj = {};
  for (const [key, value] of sp) {
    obj[key] = value;
  }
  return obj;
}

export function parseDeepLink(deepLink: string): DeepLink {
  const parsedUrl = new URL(deepLink);
  const { api_base, reference_id } = searchParamsToObject(
    parsedUrl.searchParams
  );
  return { apiBase: api_base, referenceId: reference_id };
}
