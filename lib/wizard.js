import Engine from './engine';
import inquirer from 'inquirer';
import _ from 'lodash';
import { safeFen, createTimedCommand } from '../util/util';

class Wizard {
  // When creating new wizard, wait for engine to initialize, then prompt
  constructor() {
    let self = this;
    // Initialize our Stockfish engine
    this.engine = new Engine({
      initialized: () => {
        self.basePrompt();
      }
    });
  }

  // Main app control flow prompt
  basePrompt() {
    inquirer.prompt([{
      type: 'list',
      name: 'operation',
      message: 'What do you want to do?',
      choices: [{
        name: 'Show current position',
        value: 'showpos',
        short: 'Show position'
      }, {
        name: 'Make a move',
        value: 'make',
        short: 'Make'
      }, {
        name: 'Evaluate current position',
        value: 'eval',
        short: 'Eval position'
      }, {
        name: 'Find and make best move',
        value: 'battle',
        short: 'Battle'
      }, {
        name: 'What\'s my best move?',
        value: 'go',
        short: 'Go'
      }, {
        name: 'Set new position',
        value: 'setpos',
        short: 'Set position'
      }, {
      //   name: 'Ponder responses to my opponents best move',
      //   value: 'ponder',
      //   short: 'Ponder'
      // }, {
        name: 'Exit',
        value: 'exit',
        short: 'exit'
      }]
    }], (answers) => {
      if (answers.operation === 'exit') {
        process.exit(0);
      } else if (answers.operation === 'setpos') {
        this.positionPrompt();
      } else if (answers.operation === 'showpos') {
        this.showPosition();
      } else if (answers.operation === 'eval') {
        this.evaluatePosition();
      } else if (answers.operation === 'ponder') {
        this.ponder(10000);
      } else if (answers.operation === 'go') {
        this.go();
      } else if (answers.operation === 'make') {
        this.make();
      } else if (answers.operation === 'battle') {
        this.battle();
      }
    });
  }

  // Allow the user to choose to reset board or enter FEN string
  positionPrompt() {
    inquirer.prompt([{
      type: 'list',
      name: 'position',
      message: 'How should I set the new position?',
      choices: [{
        name: 'Reset to starting position',
        value: 'startpos',
        short: 'startpos'
      }, {
        name: 'Set position via FEN string',
        value: 'fen',
        short: 'fen'
      }]
    }], (answers) => {
      if (answers.position === 'startpos') {
        this.engine.send('position startpos', () => {
          this.basePrompt();
        });
      } else if (answers.position === 'fen') {
        this.setPosition();
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
      this.engine.send('position ' + safeFen(answers.startpos), () => {
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
  go() {
    this.engine.send('go', () => {
      this.basePrompt();
    });
  }

  // Make a move on the board
  make() {
    inquirer.prompt([{
      type: 'input',
      name: 'move',
      message: 'What move should I make? (eg. `e2e4`)'
    }], (answers) => {
      // Maybe do some validation here
      this.engine.send(`makemove ${answers.move}`, () => {
        this.basePrompt();
      });
    });
  }

  // Enter battle mode
  battle() {
    let self = this;
    self.engine.findAndMakeBestMove(() => {
      self.basePrompt();
    });
  }
}

module.exports = Wizard;