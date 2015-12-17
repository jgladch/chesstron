import chalk from 'chalk';
import inquirer from 'inquirer';
import _ from 'lodash';

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
  }

  log(level, message) {
    if (this.showLog) {
      console.log(`${chalk[this.levelMap[level]](level)}: ${chalk[this.color](message)}`);
    }
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