# DevMod Developer {Mod}ule

Developer decorators for deugging your apps.

Currently supports Angular

<img src="./docs/demo.gif" alt="Invocation UI for manual entry" width="45%" align="right"/>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Features](#features)
* [About](#about)
* [Installation](#installation)
  * [Install the dependencies](#install-the-dependencies)
  * [Setting up your environment](#setting-up-your-environment)
  * [Enabling debug mode](#enabling-debug-mode)
  * [Import in the interface module](#import-in-the-interface-module)
  * [Add in the toggle](#add-in-the-toggle)
  * [Setting up your Developer Functions](#setting-up-your-developer-functions)
* [Demo and Developing](#demo-and-developing)
* [Contributing](#contributing)
  * [Other (Non Angular) Libraries](#other-non-angular-libraries)
* [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

* Call arbitrary methods on components from a special developer interface
  * Quickly fill forms with random data using tools like [faker](https://github.com/marak/Faker.js/)
  * One-click login to development accounts
* Call methods on your services and providers
* Hide developer tools in production builds
* Debug the output of observables
* Summon the developer tools with a global Floating Action Button or backtick (`) hotkey
* Change arguments for developer functions on the fly by holding Alt/Option

Coming Soon

* Register custom components to render in the list to provide your own extensions
* Better support for debugging observables

You can read more detail about the various features in depth:

* [Developer Function](./docs/DEVELOPER_FUNCTION.md)
* [Developer Category](./docs/DEVELOPER_CATEGORY.md)
* [Developer Module](./docs/DEVELOPER_MODULE.md)
* [Devmod Toggle](./docs/DEVMOD_TOGGLE.md)
* [Devmod List](./docs/DEVMOD_LIST.md)
* [Debug Observable](./docs/DEBUG_OBSERVABLE.md)

## About

This project was an attempt to reproduce similar core functionality to the Android developer library [DevFun](https://github.com/NextFaze/dev-fun). The idea being to provide tools to aid in debugging Angular applications in a similar way without overlapping functionality with any of the amazing existing developer tools like Chrome devtools and [Augury](https://augury.angular.io/).

If you're interested in how the module works you can check out [this Medium article](https://medium.com/@zbarbuto/75a6cb1e9529).

## Installation

(Quickest way is probably to have a look at the demo app)

### Install the dependencies

`npm i --save @devmod/{core,interface}`

The interface also relies on Angular CDK for the modal so that also needs to be installed if you do not have it (or angular material) already

`npm i --save @angular/cdk`

### Setting up your environment

In order for tree shaking to work properly - you will want your `production` argument to be exported as a static boolean rather than part of an object - so update your `environment.prod.ts` file as follows (and others as required)

```ts
export const production = true;
export const environment = {
  production
};
```

### Enabling debug mode

Create a new `devmod.config.ts` file with the following config

```ts
import { production } from './environments/environment';
import { enableDebugMode } from '@devmod/core';

if (!production) {
  enableDebugMode(); // Ensures all the decorators do what they should
}
```

and update your `main.ts` file as follows:

```ts
import './devmod.config'; // Must be first!
// ... remaining imports
```

### Import in the interface module

We provide a non-functional standin Module when running in production mode. In your `app.module.ts` import both, and select the module to use based on the `production` variable.

```ts
import { DevmodInterfaceModule, DevmodNoopModule } from '@devmod/interface';
import { production } from '.../environments/environment';

let devmod = DevmodNoopModule; // Use 'noop' module in production so we don't see devmod toggle
if (!production) {
  devmod = DevmodInterfaceModule; // Use real devmod module in development
}
```

Once you have the devmod module ready to go, import it as part of your app bootstrap:

```ts
@NgModule({
  declarations: [
    // app declarations
  ],
  imports: [
    // import Devmod
    devmod
    // the rest of your imports
  ]
  // the rest of your bootstrap code
})
export class AppModule {}
```

### Add in the toggle

The toggle gives you a Floating Action Button on top of your app.

Update your `app.component.html`

```html
<!-- Your current app.component.html code -->
<devmod-toggle></devmod-toggle>
```

### Setting up your Developer Functions

In your `app.component.ts` (or any component you like, really)

```ts
import { DeveloperFunction } from '@devmod/core';

@Component({
  templateUrl: './app.component.html',
  selector: 'app-root'
})
export class AppComponent {
  @DeveloperFunction()
  doSomethingCool() {
    // Let's do something cool!
  }
}
```

_**NOTE**: components will only show in the DevMod list if they are in the DOM_

## Demo and Developing

This project was scaffolded with the Angular cli. The internal libraries are [generated](https://github.com/angular/angular-cli/wiki/stories-create-library) using the cli.

You can build the two modules by running `ng build core --prod && ng build interface --prod`

You can then start up the demo app by running `ng serve`

## Contributing

DevMod is intended for developers (though it can be handy for testers). So, if there is anything you want or think should be added then create an issue or PR and more than likely it will be accepted.

Any bugs please report (desirably with reproduction steps) and/or PR/fix them.

Feel free also to submit your own handy util functions or whatever for submission.

### Other (Non Angular) Libraries

Although DevMod is mainly geared towards Angular applications - it was built in a way which is (hopefully) able to be extended to any other library by adding the necessary parts. If you are familliar with some other library and want to use the features of DevMod then feel free to make a PR and we'll be more than happy to add it to the main codebase and help you get it up and running.

`ApplicationHandler` would need to be extended to provide an observable of items with Developer Functions on them and a separate interface that could be imported to work with the given framework.

## License

```
Copyright 2018 NextFaze

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
