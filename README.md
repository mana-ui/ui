# ui
One more react UI components library

# Get Started

## Install

``` shell
pnpm add @mana-ui/ui @mana-ui/md
```

or

``` shell
yarn add @mana-ui/ui @mana-ui/md
```

or

``` shell
npm install @mana-ui/ui @mana-ui/md
```

## Configure Design System
``` javascript
import {SystemProvider, Button} from '@mana-ui/ui'
import * as md from '@mana-ui/md'

const App = () => (
    <SystemProvider system={md}>
        <Button>button of material design</Button>
    </SystemProider>
)

```
