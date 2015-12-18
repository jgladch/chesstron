import chalk from 'chalk';
import inquirer from 'inquirer';
import _ from 'lodash';
import figlet from 'figlet';

class Logger {
  constructor(options = {}) {
    this.options = _.defaults(options, { // Have some sensible defaults
      color: 'blue',
      showLog: true, // Show logger.log output?
      showDebug: false, // Show logger.debug output?
      showThinking: false, // Show engine output while it computes?
      levelMap: {
        'Line': 'yellow',
        'Sending': 'red',
        'Best': 'magenta',
        'Engine': 'cyan'
      }
    });

    _.each(options, (value, key) => { // Map options to properties
      this[key] = value;
    });

    this.initializing = true; // Don't print output until engine has initialized
  }

  /**
   * Use chalk to print pretty colors to console, disabled by `showLog` or `initilized` 
   * @param {String} level The log level of the message
   * @param {String} message The message to be logged
   */
  log(level, message) {
    if (this.showLog && !this.initializing && this.printThinking(message)) {
      console.log(`${chalk[this.levelMap[level]](level)}: ${chalk[this.color](message)}`);
    }
  }

  // Enable the Logger after the engine has initialized
  enable() {
    this.initializing = false;
    console.log(figlet.textSync('Chesstron', {}));
  }

  // Toggle logging
  toggleShowLog() {
    this.showLog = !this.showLog;
  }

  // Log debug messages to console
  debug(...messages) {
    if (this.showDebug) console.log(...messages);
  }

  // Set color of log messages
  setColor(color) {
    this.options.color = color;
  }

  // Filter out `info` messages based on showThinking setting
  printThinking(message) {
    if (this.options.showThinking) { // Show all messages
      return true;
    } else { // Filter out `info` messages
      return message.indexOf('info') === 0 ? false : true;
    }
  }

  // // Prompt user for change text color
  colorPrompt(callback) {
    inquirer.prompt([{
      type: 'list',
      name: 'color',
      message: 'What color do you like most?',
      choices: [
        'red',
        'green',
        'blue',
        'yellow',
      ]
    }], (answers) => {
      this.options.color = answers.color;
      if (_.isFunction(callback)) {
        callback();
      }
    });
  };
}

module.exports = Logger;