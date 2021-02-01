# ui
One more react UI components library

# Get Started

## Install

``` shell
pnpm add @mana-ui/ui @mana-ui/md react-jss
```

or

``` shell
yarn add @mana-ui/ui @mana-ui/md react-jss
```

or

``` shell
npm install @mana-ui/ui @mana-ui/md react-jss
```

## Configure Design System
``` javascript
import {SystemProvider, Button} from '@mana-ui/ui'
import * as md from '@mana-ui/material'

const App = () => (
    <SystemProvider system={md}>
        <Button>button of material design</Button>
    </SystemProider>
)

```

## Configure CSS order

The order of CSS rules may affect application apperance, you can set CSS insertion point by placing a comment node.

Mana UI uses 'mana-insertion-point' as the insertion potin opinionatedly.

``` html
<head>
    <!-- mana-insertion-point -->
    <link href="...">
</head>
```

To make sure the insertion point works, we should keep using the same JSS instance from JSS context, so we take react-jss as peer dependency, which will be resolved from the same location across all Mana UI packages.