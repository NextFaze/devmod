### @DebugObservable(options?: DebugObservableConfig)

Show the recent emissions from an observable in the tools.

_Note_ This is a new feature and is largely experimental.

```ts
DebugObservableConfig {
  label?: string;
  // Number of recent emissions to show - defaults to 5
  takeLast?: number;
  // Log each emission to the console. Defaults to false
  log: boolean;
  // Log each time the observable is subscribed to with a stack trace. Defaults to false
  logSubscriptions?: boolean;
}
```

Example usage:

```ts
@Component({
  /* ... */
})
export class UserComponent {
  @DebugObservable({
    log: true,
    logSubscriptions: true
  })
  users$ = this.store.select(selectors.userList);
}
```
