# Codeberg Fonts
An internal font hosting site for Codeberg

## About
Currently, Codeberg Fonts is intended to be an internal, central site for hosting
fonts for the various web sites that belong to Codeberg.

That is to improve performance, reduce traffic and to be able to easily distribute
complete web fonts, without inflating the size of the individual site repositories
too much.


## Structure
In `content/_data` you can find a YAML file for each font that is hosted on Codeberg fonts.
That file describes where to get and how to build the font, as well as its licensing.

The contents of these yaml files are used to build the final site.


## Usage
### Local Development
If you want to work on the site the easiest way to do so is to fork the codeberg-fonts
repository and develop locally.

First, run

```npm install```

to install all dependencies (they will be installed only for this project, not globally).
You only have to do this once.

Then run

```npm run serve```

to start a development web server that by default is listening at `http://localhost:8080`.

Now you can simply change, add or remove files, save them and the development server
should automatically reload all changed pages using the amazing Browsersync.

Be advised that the fonts will not be automatically rebuilt, so if you add or modify files
in a way that requires the font to be rebuilt, please stop the server, run

```npm run build-fonts```

and then start the server again.

### Build & Deployment
Like for local development, before building and deploying you first have to install
the dependencies (once):

```npm install```

To build the entire website to the `_site` directory run

```npm run build```

Instead, to directly publish the page to Codeberg pages, you can also run

```npm run deploy```

which includes a call to `npm run build`.


## Copyright and Licensing
This website (excluding bundled and/or shipped fonts) is licensed under CC-BY-SA 4.0.
Please see the [LICENSE.md](LICENSE.md) file for details.