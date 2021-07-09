import test from 'ava';

import { parseUri } from '.';

test('parseUri', (t) => {
  const { baseUrl, referenceId } = parseUri('');
  t.is(baseUrl, '');
  t.is(referenceId, '');
});
