# Tispec

This module has been created to facilitate Titanium app testing.

It uses some awesome technos :
* **[Node.js](http://nodejs.org/)** : web server which runs/filters/displays your specs
* **[CoffeeScript](http://coffeescript.org/)** : helps JavaScript development
* **[Jasmine](https://github.com/pivotal/jasmine)** : behavior-driven development framework
* **[Bootstrap](http://twitter.github.io/bootstrap/)** : beautiful and responsive design

## Getting Started

* Add the Tispec client librairies included in `tispec/App/Resources/lib/tispec` into your app under `YourApp/Resources/lib/tispec`.

* Create your first specs under `YourApp/Resources/specs`. All the js files included in this folder will be executed by Tispec.

* Add this line in your app to connect it to the tispec server:

```js
// These ports are defined in server/TispecServer and lib/BroadcastServer
// 8128 : sockets server port
// 8666 : nodejs server port
require('./lib/tispec/Tispec').initialize('localhost', 8128, 8666);
```

* Install the node environment:

```bash
npm install
```

* Run you server:

```bash
node index.js
```

* Open the [Tispec dashboard](http://localhost:8666/) in your favorite browser
* Run you app.

Your app should be detected automatically by the [Tispec dashboard](http://localhost:8666/), and you'll juste have to click on **Run**.


## Image comparison

With Tispec, you can automate UI specs.
Indeed, it includes a feature that allows images comparison. Thus, you can compare the actual opened window in your app with a screenshot taken previously.

This feature uses a librairie available on windows/mac/linux : [GraphicsMagick](http://www.graphicsmagick.org/). If you want to use it, you'll have to install it on your computer.
To do that, follow the instructions to install the node module [GraphicsMagick for node](https://github.com/aheckmann/gm#getting-started).

Then in your specs, you'll just have to call:

```js
compareScreenshots(PATH_OF_THE_EXPECTED_SCREEN_IMAGE);
```

It will compare the screen displayed on your app with the `PATH_OF_THE_EXPECTED_SCREEN_IMAGE` one. Your spec will pass only if your screen is stricly the same as your reference picture (the comparison is made pixel by pixel).
