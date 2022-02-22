<p align="center">
  <img src="https://octodex.github.com/images/manufacturetocat.png" height="200px"/>
  <br><br>
  <b>One time migrations for primer/react</b>
</p>

&nbsp;

```
npx primer-react-migrate [src directory] -p [preset name]

# or
npx primer-react-migrate [src directory] -m [migration name]

# Example:
npx primer-react-migrate src/client -p v35

npx primer-react-migrate src/client -m use-deprecated-button
```

&nbsp;

### Available migrations::

```
use-deprecated-flex.js
use-deprecated-grid.js
use-deprecated-position.js
// todo: use-deprecated-borderbox
// todo: use-deprecated-dialog
// todo: use-deprecated-dropdown
use-deprecated-formgroup.js
use-deprecated-selectmenu.js

use-deprecated-button
use-deprecated-actionlist.js
use-deprecated-actionmenu.js
use-deprecated-dropdownmenu.js

use-main-button.js
use-main-actionlist.js
use-main-actionmenu.js
use-main-pagelayout.js
```
