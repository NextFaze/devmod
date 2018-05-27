import { Observable } from 'rxjs';

export let patches = {
  subscriptions: 0
};

let APPLIED = false;

export const applyPatches = () => {
  if (APPLIED) {
    // Only monkeypatch once to avoid incorrect counts
    return;
  }
  const sub = Observable.prototype.subscribe;

  // Monkeypatch Observable.subscribe globally so we can track how many exist
  Observable.prototype.subscribe = function(...args) {
    patches.subscriptions++;
    const sink = sub.call(this, ...args);
    const unsub = sink.unsubscribe;
    sink.unsubscribe = (...unsubArcs) => {
      patches.subscriptions--;
      unsub.call(sink, ...unsubArcs);
      sink.unsubscribe = unsub.bind(sink);
    };
    return sink;
  };
  APPLIED = true ;
};
