import Engine from './engine';
import inquirer from 'inquirer';
import _ from 'lodash';

class Wizard {
  // When creating new wizard, wait for engine to initialize, then prompt
  constructor() {
    let self = this;
    this.engine = new Engine(() => {
      self.basePrompt();
    });
  }

  // Main app control flow prompt
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
        name: 'Evaluate current position',
        value: 'eval',
        short: 'Eval position'
      }, {
        name: 'Find best move in current position',
        value: 'best',
        short: 'Best move'
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
      } else if (answers.operation === 'eval') {
        this.evaluatePosition();
      } else if (answers.operation === 'best') {
        this.findBestMove(10000);
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
      this.engine.send('position ' + cleanFen(answers.startpos), () => {
        this.basePrompt();
      });
    });
  }

  // Print current position to terminal
  showPosition() {
    this.engine.send('d', () => {
      this.basePrompt();
    });
  }

  // Evaluate the position and wait for finish
  evaluatePosition() {
    this.engine.send('eval', () => {
      this.basePrompt();
    });
  }

  // Find the best move in the current position
  findBestMove(time) {
    let self = this;
    this.engine.send('go ponder', () => {
      self.engine.send('stop', () => {
        self.basePrompt();
      });
    });

    if (time) {
      setTimeout(() => {
        self.engine.send('stop');
      }, time);
    }
  }
}

let cleanFen = (string) => {
  if (string.indexOf('fen ') !== 0) {
    return `fen ${string}`;
  } else {
    return string;
  }
};

module.exports = Wizard;