<p align="center">
  <img src="https://github.com/derech1e/SonarSocket/blob/main/sonarsocket.png?raw=true" alt="SonarSocket Logo" width="400" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/derech1e/SonarSocket" alt="License" />
  <img src="https://img.shields.io/github/languages/top/derech1e/SonarSocket" alt="Top Language" />
  <img src="https://img.shields.io/github/last-commit/derech1e/SonarSocket" alt="Last Commit" />
  <img src="https://img.shields.io/github/issues/derech1e/SonarSocket" alt="Issues" />
  <img src="https://img.shields.io/github/actions/workflow/status/derech1e/SonarSocket/CI.yml?branch=main" alt="Build Passing"/>
</p>
SonarSocket is a server-side API that allows you to control a plug with a scheduling service. The API checks the water height in a cistern every X minutes and controls the plug accordingly.

## Installation

```bash
$ git clone https://github.com/derech1e/SonarSocket.git
$ cd SonarSocket
$ yarn install
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Technologies

SonarSocket uses the following technologies:

- [Node.js](https://nodejs.org/) - a JavaScript runtime built on Chrome's V8 JavaScript engine
- [Socket.IO](https://socket.io/) - enables real-time, bidirectional and event-based communication between the browser
  and the server
- [Tasmota](https://tasmota.github.io/docs/) - alternative firmware for ESP8266/ESP32 based devices with easy
  configuration using webUI, OTA updates, automation using timers or rules, MQTT, KNX, serial communication, and more.

## Issues

SonarSocket is an MIT-licensed open source project. Contributions, issues and feature requests are welcome. Feel free to
check [issues page](https://github.com/derech1e/SonarSocket/issues) if you want to contribute.

## Stay in touch

- Author - [derech1e](https://github.com/derech1e)

## License

SonarSocket is [MIT licensed](https://github.com/derech1e/SonarSocket/blob/main/LICENSE).