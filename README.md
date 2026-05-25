# scriptable-ios-utils

A collection of Scriptable scripts I actually use on my iPhone for widgets, automations, and miscellaneous utilities built up over time. Nothing precious here; steal whatever's useful.

## Directory Structure

```
scriptable-utils/
├── {feature}/
│   ├── wdg-{widget-name}.js
│   ├── atm-{automation-name}.js
│   ├── utl-{utility-name}.js
│   ├── ...
│   └── README.md
├── lib/
|   ├── keys.js                     # This is for your Keychain KEYS, do not bind values here. Use the feature's associated `utl-config.js` script for secure Keychain storage.
|   ├── oauth.js
|   ├── {feature}.js
│   └── ...
├── Makefile
└── README.md
```

## Usage

Each feature folder has its own README.md with setup instructions and whatever Keychain keys you'll need to seed. Scripts are prefixed by type (wdg- for widgets, atm- for automations, utl- for the stuff you run manually). Heavy lifting lives in lib/; the scripts themselves are mostly just wiring.

## Deployment

Scriptable runs scripts from a flat directory. The repo structure is for organization only; scripts are flattened into `dist/` before deploying to your device.

**Build:**
```bash
make deploy
```

This flattens all scripts from feature folders and `lib/` into `dist/`. Copy the contents of `dist/` to your Scriptable iCloud folder or cloud storage of choice.

All `importModule` calls use flat names (e.g. `importModule("oauth")`), not relative paths.

## Contributing

These are personal scripts, so I'm not actively maintaining them for general use - but PRs and issues are welcome if something is broken or you've made something better.

## License

MIT — take what you want.
