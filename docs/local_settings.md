# How to add local settings

You can add a local config file and fill it with your custom data. So the application won't need to
make addition network requests for them.

1. Create a new JSON file `config.json` inside of a directory: `src/`. Copy this object there and fill it:

```json5
{
  "admin": "",
  "contracts": {
    "<network ID>": {
      "factory": "",
      "router": ""
    }
  },
  "protocolFee": "",
  "totalFee": "",
  "allFeeToProtocol": "",
  "possibleProtocolPercent": [],
  "totalSwaps": "",
  "factory": "",
  "router": "",
  "pairHash": "",
  "feeRecipient": "",
  "domain": "",
  "projectName": "",
  "brandColor": "",
  "backgroundColorDark": "",
  "backgroundColorLight": "",
  "textColorDark": "",
  "textColorLight": "",
  "logo": "",
  "favicon": "",
  "background": "",
  "tokenListsByChain": {},
  "tokenLists": [],
  "navigationLinks": [],
  "menuLinks": [],
  "socialLinks": [],
  "addressesOfTokenLists": [],
  "defaultSwapCurrency": { "input": "", "output": "" }
}
```
