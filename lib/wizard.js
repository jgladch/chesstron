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
        name: 'Find my best move',
        value: 'go',
        short: 'Go'
      }, {
        name: 'Ponder responses to my opponents best move',
        value: 'ponder',
        short: 'Ponder'
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
      } else if (answers.operation === 'ponder') {
        this.ponder(10000);
      } else if (answers.operation === 'go') {
        this.go();
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
  ponder(time) {
    createTimedCommand('go ponder', 5000, this)();
  }

  // Tell the engine to go
  go(options = {}) {
    options = _.defaults(options, {
      depth: 10,
    });
    // createTimedCommand('go', 0, this)();
    this.engine.send(`go depth ${options.depth}`, () => {
      this.basePrompt();
    });
  }
}

let createTimedCommand = (command, time, self) => {
  return () => {
    self.engine.send(command, () => {
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
};

let cleanFen = (string) => {
  if (string.indexOf('fen ') !== 0) {
    return `fen ${string}`;
  } else {
    return string;
  }
};

module.exports = Wizard;