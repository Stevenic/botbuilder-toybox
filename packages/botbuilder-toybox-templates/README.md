# botbuilder-toybox-extensions
A collection of controls for the JavaScript version of [Bot Builder v4](https://github.com/Microsoft/botbuilder-js).  This is part of a broader set of [botbuilder-toybox](https://github.com/Stevenic/botbuilder-toybox) packages designed to enhance the bot building experience. 

- [Installing](#installing)
- [Conceptual Docs](https://github.com/Stevenic/botbuilder-toybox/blob/master/docs/README.md)
- [Reference Docs](https://github.com/Stevenic/botbuilder-toybox/blob/master/docs/reference/README.md)

## Installing
To add the preview version of this package to your bot be sure include the @preview tag:

```bash
npm install --save botbuilder-toybox-controls@preview
```

While this package is in preview it's possible for updates to include build breaks. To avoid having any updates break your bot it's recommended that you update the dependency table of your bots `package.json` file to lock down the specific version of the package you're using:

```JSON
{
    "dependencies": {
        "botbuilder": "4.0.0-preview1.2",
        "botbuilder-toybox-controls": "0.1.0-preview1.2"
    }
}
```
