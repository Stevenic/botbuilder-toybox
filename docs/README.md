# botbuilder-toybox
A collection of npm packages that provide useful extensions for the JavaScript version of [Bot Builder v4](https://github.com/Microsoft/botbuilder-js).

- [Overview](#overview)
- [Installing](#installing-packages)
- Conceptual Docs
  - [Memories](./memories.md)
  - [Controls](./controls.md)
  - [Middleware](./middleware.md)
  - [Utilities](./utilities.md)
- [Reference Docs](./reference/README.md)
- [Building Packages](./building.md)

## Overview
The packages in toybox represent various bot related ideas that I'm currently exploring. In some cases I'm just working out how something should work before being included in the main Bot Builder SDK and in other cases they're too opinionated to be in the core SDK. While you could consider them experimental the plan is to follow standard semantic versioning rules so once published I'd personally consider them safe for production use and of course your feedback, ideas, and bug fixes are always welcome.

I've already had to deprecate two of the packages (**botbuilder-toybox-prompts** and **botbuilder-toybox-dialogs**) because we ended up promoting them to being official packages in the SDK. If any of the other packages in this collection end up becoming overly popular I'd expect them to likely suffer a similar fate, in which case the toybox package will be deprecated and instructions for migrating to the official package will be provided.  

## Installing Packages
While the v4 SDK is in "preview" status the packages here will also remain in preview. Breaking changes should be expected but I'll try to make them as gentle as possible.  You can install the preview versions of the packages from NPM using an @preview tag:

```bash
npm install --save botbuilder-toybox-memories@preview
npm install --save botbuilder-toybox-extensions@preview
```
While these package is in preview it's possible for updates to include build breaks. To avoid having any updates break your bot it's recommended that you update the dependency table of your bots `package.json` file to lock down the specific version of the package you're using:

```JSON
{
    "dependencies": {
        "botbuilder": "4.0.0-preview1.1",
        "botbuilder-toybox-memories": "0.1.0-preview1.0",
        "botbuilder-toybox-extensions": "0.1.0-preview1.0"
    }
}
```
