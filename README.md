<p align="center">
  <img src="https://octodex.github.com/images/manufacturetocat.png" height="200px"/>
  <br><br>
  <b>One time migrations for primer/react</b>
</p>

&nbsp;

```
npx primer-react-migrate [src directory] -p [preset name] [--create-commits]

# or
npx primer-react-migrate [src directory] -m [migration name] [--create-commits]

# Example:
npx primer-react-migrate src/client -p v35 --create-commits

npx primer-react-migrate src/client -m use-deprecated-button
```

&nbsp;

### Available migrations::

```
use-deprecated-flex
use-deprecated-grid
use-deprecated-label
use-deprecated-position
use-deprecated-dropdown
use-deprecated-borderbox
use-deprecated-formgroup
use-deprecated-selectmenu

use-deprecated-button
use-deprecated-actionlist
use-deprecated-actionmenu
use-deprecated-dropdownmenu
use-deprecated-dropdownbutton
use-deprecated-inputfield
use-deprecated-choicefieldset
use-deprecated-choiceinputfield

use-main-label
use-main-button
use-main-actionlist
use-main-actionmenu
use-main-pagelayout
```
