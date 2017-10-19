export default `
# ‌‌  zerke


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).






## Features

@zerke@ is a mvp with my the following features:
* **easy to maintain**
* **PWA** - has Progressive Web App features
* **responsive** - included with PWA
* **material-ui**
* **routing**
* **theming**
* **forms** - with realtime sync of untouched fields
* **internationalization**
* **authentication**

All these features can be programmed from scratch. But why should you do this? Out there are so mutch greate developers creating greate applications, libraries and tools to help them and you to develop fast and easy. This should also be a small part from my side to help other make they'r starting with react much easier.

If all that is true why did I create this project? There must be already a starter kit for react applications! Well, there are lots of them but unfortunaly non of them was as I would like it to be. Some don't have enough fatures to just start and some are have so many that I had to delete features I don't need. I want to create a starting point that has, as said before, my **personal** "Most Wanted" features. If someone likes it, greate :)

There are also other cool features:
* **realtime database**
* **realtime forms**
* **messaging/notifications** - every loged user that approved messaging on login will recieve notifications for new tasks created
* **full authentication** - with google, facebook, twitter, github, email and **phone**
* **online and last time offline state for users**
* **file uploads to the firebase storage**s

The further text explains witch libraries/modules are used and why. Some of them are installed and used in they're @pure@ way as in documentation described so in that cases we will just show the link to the official documentation to awoid outdated descriptions of the usage.

## Folder Structure

The project has following folder structure:

@@@
zerke-app/
  .gitignore
  README.md
  node_modules/
  package.json
  sw-precache-config.js
  public/
    icons/
    index.html
    favicon.ico
    manifest.json
  src/
    components/
    containers/
    firebase/
    utils/
    locales/
    store/
      index.js
      reducers.js
    themes/
    config.js
    index.js
@@@

All application parts and code should be stored in the @src@ folder.

All @react@ components shold be seperated in presentational and container compnents. This greate [article](https://www.fullstackreact.com/p/using-presentational-and-container-components-with-redux/) is describing it why and how. For that purpose we have the @components@ and @containers@ folders.

All @redux@ related files are in the @store@ folder. You can find more about redux [here](http://redux.js.org/docs/introduction/).

The folders @locales@ and @themes@ are used to store data for different locales and themes.



## License

MIT


`.trim().split("@").join("`");
