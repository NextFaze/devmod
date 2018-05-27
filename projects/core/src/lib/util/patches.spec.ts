import { of } from 'rxjs';

import { patches } from './patches';

describe('Monkey Patches', () => {
  it('should monkeypatch subscribe to track subscriber count', () => {
    const prev = patches.subscriptions;
    const sub = of([]).subscribe();
    expect(patches.subscriptions).toEqual(prev + 1);
    sub.unsubscribe();
    expect(patches.subscriptions).toEqual(prev);
  });
});
