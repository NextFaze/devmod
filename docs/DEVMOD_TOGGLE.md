### <devmod-toggle>

Place the Floating Action Button (FAB) that summons the DevMod list tools.

#### Inputs

| Input            | Description                                              |     Default |
| ---------------- | -------------------------------------------------------- | ----------: |
| `left`           | Set the default starting left position of the button     | `undefined` |
| `right`          | Set the default starting right position of the button    |    `0.5rem` |
| `top`            | Set the default starting top position of the button      | `undefined` |
| `bottom`         | Set the default starting bottom position of the button   |     `10rem` |
| `dragTolerance`  | Distance the FAB can be dragged before disabling opening |         `4` |
| `enableHotkey`   | Toggle the backtick (\`) hotkey to summon the tools      |      `true` |
| `disableMessage` | Disable the console welcome message for the devtools     |     `false` |

The toogle uses [Angular 2 Draggable](https://www.npmjs.com/package/angular2-draggable) so it can be repositioned on the screen.
