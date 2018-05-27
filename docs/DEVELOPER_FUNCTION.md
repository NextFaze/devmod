### @DeveloperFunction(options?: DeveloperFunctionOptions)

Registers a new developer function on the given class.

```ts
DeveloperFunctionOptions {
  label?: string;
  args?: any;
  sort?: number | string;
  autoclose?: boolean;
}
```

Note, if you just want to change the button title - you can just pass in a string:

```ts
@DeveloperFunction('Skip Login Screen')
navigateToDash() {}
```

### Options

#### label

The label to put on the button in the interface. Default is the function name converted to title case (e.g. `doSomethingCool` becomes "Do Someting Cool").

#### args

Arguments to be passed to the method call when the button is clicked. This can either be an array of arguments:

```ts
@DeveloperFunction({
  args: ['Emmett', 'Brown']
})
setUserName(firstName: string, lastName: string) {}
```

or stringified javascript that will be `eval()`d with the component as `this`. The function should return
an array of arguments:

```ts
@DeveloperFunction({
  args: `(() => [this.firstName.toUpperCase(), this.lastName.toUpperCase])()`
})
capitalizeName(firstName: string, lastName: string) {}
```

**Note for Production Builds**

If you're passing in login credentials or other secrets make sure that they are tree shaken in production builds.

```ts
// Note - this must be an imported boolean. Tree shaking won't handle using `environment.production`
import { production } from '../environments/environment';
import { DeveloperFunction } from '@devmod/core';

@DeveloperFunction({
  label: 'Login as Admin',
  // Your production build should not contain the actual credentials
  args: production ? [] : ['admin', 'hunter2']
})
login(username: string, password: string) {}
```

#### sort

Custom value to use when sorting buttons. Defaults to alphabetical sorting.

```ts
@DeveloperFunction({ sort: 1 })
superImportantComesFirst() {}

@DeveloperFunction({ sort: 2 })
comesFirstAlphabetically() {}
```

#### autoclose

Defaults to `true`. Set to `false` to disable automatically closing the devmod interface when the button for this method is clicked.
