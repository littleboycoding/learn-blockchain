# Randomize via Oracle method

Yes, this is centerialized method We need to trush whoever providing randomized value.

And DAPP might be in trouble if provider is down for some reason.

So this is not preferable way to randomized value.

## Setup

```sh
$ npm install
$ hh compile
$ hh node
$ hh run scripts/deploy.js
$ hh run scripts/provider.js
$ hh run scripts/trigger.js
```

Now Ethers node should log the randomized value.
