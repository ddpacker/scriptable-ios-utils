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
|   ├── keys.sample.js             # Copy to keys.js and fill in your own Keychain key names.
|   ├── oauth.js
|   ├── {feature}.js
│   └── ...
└── README.md
```

## Usage

Each feature folder has its own README.md with setup instructions and whatever Keychain keys you'll need to seed. Scripts are prefixed by type (wdg- for widgets, atm- for automations, utl- for the stuff you run manually). Heavy lifting lives in lib/; the scripts themselves are mostly just wiring.

## Contributing

These are personal scripts, so I'm not actively maintaining them for general use - but PRs and issues are welcome if something is broken or you've made something better.

## License

MIT — take what you want.
