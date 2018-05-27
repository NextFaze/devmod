### @DeveloperCategory(options?: CategoryConfig)

```ts
CategoryConfig {
  label?: string;
  sort?: number | string;
  // Enable to hide the 'outline component' button
  hideOutline?: boolean,
  // Enable to add some padding to the category's button in the list
  padding?: boolean,
}
```

Customises the way that your component or service appears in the tools.

```ts
@DeveloperCategory({
  // Label for the button in the tools
  label: 'App Wide Functions',
  // Always appear first in the list
  sort: 1
})
export class MyAppService {
  @DeveloperFunction()
  goToDashboard() {}
}
```
