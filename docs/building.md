# Building
In order to build the packages, ensure that you have [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/) installed.

Clone a copy of the repo:

```bash
git clone https://github.com/Stevenic/botbuilder-toybox.git
```

Change to the toybox directory:

```bash
cd botbuilder-toybox
```

Install [Lerna](https://lernajs.io/) and dev dependencies:

```bash
npm install --global lerna
npm install --global typescript
npm install --global mocha
npm install
```

Run lerna bootstrap:

```bash
lerna bootstrap --hoist
```

Run any of the following scripts to build and test:

```
lerna run build       # Build all of the extension packages.
lerna run clean       # Delete all built files for extension packages.
lerna run test        # Execute all unit tests for extension packages.
lerna run build-docs  # Generate all reference documentation for packages.    
```
