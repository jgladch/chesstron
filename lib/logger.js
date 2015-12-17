import chalk from 'chalk';
import inquirer from 'inquirer';

class Logger {
  constructor(color, level) {
    this.color = color || 'blue';
    this.print = true;
    this.showDebug = true;
    this.levelMap = {
      'Line': 'yellow',
      'Sending': 'red',
      'Best': 'magenta'
    };
  }

  log(level, message) {
    if (this.print) {
      console.log(`${chalk[this.levelMap[level]](level)}: ${chalk[this.color](message)}`);
    }
  }

  debug(message) {
    if (this.showDebug) console.log(message);
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