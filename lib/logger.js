import chalk from 'chalk';
import inquirer from 'inquirer';

class Logger {
  constructor(color, level) {
    this.color = color || 'blue';
    this.levelMap = {
      'Line': 'yellow',
      'Sending': 'red'
    };
  }

  log(level, message) {
    console.log(`${chalk[this.levelMap[level]](level)}: ${chalk[this.color](message)}`);
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