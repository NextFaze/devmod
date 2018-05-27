### @DeveloperMOdule(options?: CategoryConfig)

Register an arbitrary TypeScript class as a module to appear in the tools.

```ts
CategoryConfig {
  label?: string;
  sort?: number | string;
}
```

The class will get `new`'d when the developer tools are summoned.

Not needed (and you should not use) for Angular component and services.

```ts
@DeveloperModule({
  label: 'Window Tools',
  sort: 'z'
})
export class WindowTools {
  @DeveloperFunction()
  getWindowDimmensions() {
    console.log(`W: ${window.innerWidth}, H: ${window.innerHeight}`);
  }
}
```
