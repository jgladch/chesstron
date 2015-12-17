import Engine from './engine';
import inquirer from 'inquirer';
import Promise from 'bluebird';

class Wizard {
  constructor() {
    let self = this;
    this.engine = new Engine(() => {
      self.basePrompt();
    });
  }

  // Main app control
  basePrompt() {
    inquirer.prompt([{
      type: 'list',
      name: 'operation',
      message: 'What do you want to do?',
      choices: [{
        name: 'Set new position',
        value: 'setpos',
        short: 'Set position'
      }, {
        name: 'Show current position',
        value: 'showpos',
        short: 'Show position'
      }, {
        name: 'Exit',
        value: 'exit',
        short: 'exit'
      }]
    }], (answers) => {
      if (answers.operation === 'exit') {
        process.exit(0);
      } else if (answers.operation === 'setpos') {
        this.setPosition();
      } else if (answers.operation === 'showpos') {
        this.showPosition();
      }
    });
  }

  // Set the board position via fen string
  setPosition() {
    inquirer.prompt([{
      type: 'input',
      name: 'startpos',
      message: 'What position would you like to analyze? (FEN)'
    }], (answers) => {
      console.log(answers.startpos);
      this.engine.send('position ' + answers.startpos);
      this.engine.send('eval');
      this.waitForReady().then(() => {
        this.basePrompt();
      });
    });
  }

  // Print current position to terminal
  showPosition() {
    this.engine.send('d');
    this.waitForReady().then(() => {
      this.basePrompt();
    })
  }

  // Evaluate the position and wait for finish
  evaluatePosition() {
    this.engine.send('eval');
    this.waitForReady().then(() => {
      this.basePrompt();
    });
  }

  // Stockfish is asynchronous and doesn't provide callbacks, so we hack around it
  waitForReady() {
    return new Promise((resolve, reject) => {
      let self = this;
      let check;
      if (this.engine.thinking) {
        console.log('still thinking');
        check = setTimeout(() => {
          self.waitForReady();
        }, 500);
      } else {
        clearTimeout(check);
        resolve();
      }
    });
  }
}

module.exports = Wizard;