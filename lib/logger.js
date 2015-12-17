import chalk from 'chalk';
import inquirer from 'inquirer';
import _ from 'lodash';
import figlet from 'figlet';

class Logger {
  constructor(options = {}) {
    options = _.defaults(options, { // Have some sensible defaults
      color: 'blue',
      showDebug: false,
      showLog: true,
      levelMap: {
        'Line': 'yellow',
        'Sending': 'red',
        'Best': 'magenta'
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
    if (this.showLog && !this.initializing) {
      console.log(`${chalk[this.levelMap[level]](level)}: ${chalk[this.color](message)}`);
    }
  }

  enable() {
    this.initializing = false;
    console.log(figlet.textSync('Chesstron', {}));
  }

  debug(...messages) {
    if (this.showDebug) console.log(...messages);
  }

  togglePrint() {
    this.print = !this.print;
  }

  setColor(color) {
    this.color = color;
  }

  // // Prompt user for text color
  colorPrompt() {
    inquirer.prompt([{
      type: 'list',
      name: 'color',
      message: 'What color do you like most?',
      choices: [
        'red',
        'green',
        'blue',
        'yellow',
        'i quit this stupid game'
      ]
    }], (answers) => {

    });
  };
}

module.exports = Logger;