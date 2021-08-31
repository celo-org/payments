import test from 'ava';

import { parseDeepLink } from '.';

test('parseDeepLink', (t) => {
  const expectedReferenceId = 'd9c03bed-aa82-4d43-9e22-518e08951094';
  const expectedApiBase = 'https://gw.firstdag.com';

  const { apiBase, referenceId } = parseDeepLink(
    `celo://payment?api_base=${expectedApiBase}&reference_id=${expectedReferenceId}`
  );
  t.is(apiBase, expectedApiBase);
  t.is(referenceId, expectedReferenceId);
});
