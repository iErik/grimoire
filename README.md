## Grimoire
Grimoire is an open-source Markdown editor built entirely with web
techonologies, the project is currently under beta development phase and
it's available for download for Windows, macOS and Linux.

The goal of this project is to offer the user a clean, simple and elegant tool
for composing and organizing notes and documents written in Markdown.

If you're interesed, you can also check out the entire design process for this
project on [this GitLab repo](https://gitlab.com/Isidore/grimoire-mockup), there
you can find the Photoshop project file, icons, fonts and everything that was
used during the design process of this project.

## Building

### Requirements

- Node.js 6.x or later
- npm 3.10.x or later
- yarn (optional)

### Building for development

To run the development version of the application localy you can simply run the
following command in a terminal:

```bash
npm run dev
```

This will actually start a local development server on port `5000` by default,
you can change that by simply editing the `PORT` environment variable located
in the `config/dev.env.js` file. This development server is necessary so that
the application's assets are re-compiled and re-sent to the running application
whenever any change is made to app's code. This is called
[Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/),
any changes made to the application's code should reflect in the running app
window.

### Buidling for production

You can generate the application binaries for your specific platform simply
by running:

```bash
npm run build:pack
```

Once finished, you can find the application binary file unde the `release`
directory

### Multi-platform build

Depending on your system, there are a few packages that you need to install
first before you can actually build the application's binaries for other
platforms.

#### macOS

All required system dependencies (except rpm) will be downloaded automatically
on demand on macOS 10.12+ (macOS Sierra). You can install the rpm package with
the [Homebrew package manager](https://brew.sh/) by running the following in a
terminal:

```bash
brew install rpm
```

With that taken care of, you can build the app's binaries for all platforms
by running a single command in the terminal:

```bash
npm run build:pack:multi
```

Once the process is finished, you can find the application's binaries under
the `release` directory.

#### Linux

You can use [Docker](https://www.electron.build/multi-platform-build#docker)
to avoid installing system dependencies.

To build the application in distributable format on Linux, you'll need the
`icnsutils` package:

```bash
sudo apt-get install --no-install-recommends -y icnsutils
```

You'll also need to install the rpm package:

```bash
sudo apt-get install --no-install-recommends -y rpm
```

Replace `apt-get` with your distribution's package manager.

After that you can run:

```bash
npm run build:pack:multi
```

#### Windows

[Docker](https://www.electron.build/multi-platform-build#docker) is recommended
to avoid installing system dependencies, but if you choose not to use Docker,
you'll need to install Wine 2.0+ – see
[WineHQ Binary Packages](https://www.winehq.org/download#binary).

Having the required packages installed, you can simply run the following
command in a command line:

```bash
npm run build:pack:multi
```

## Screenshot

![Application Screenshot](/resources/screenshot.png?raw=true)

## License

Grimoire Editor is distributed under the GNU GPL license 2.0
http://www.gnu.org/licenses/gpl-2.0.html
