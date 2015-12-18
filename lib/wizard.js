import Engine from './engine';
import inquirer from 'inquirer';
import _ from 'lodash';
import { safeFen, createTimedCommand } from '../util/util';
import LichessClient from 'node-lichess';

class Wizard {
  // When creating new wizard, wait for engine to initialize, then prompt
  constructor() {
    let self = this;

    this.client = new LichessClient();

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
      name: 'prompt',
      message: 'What do you want to do?',
      choices: [{
        name: 'Use Stockfish engine',
        value: 'stockfish',
        short:'Stockfish'
      }, {
        name: 'Use LiChess',
        value: 'lichess',
        short: 'LiChess'
      }, {
        name: 'Quit',
        value: 'exit',
        short: 'Exit'
      }]
    }], (answers) => {
      if (answers.prompt === 'stockfish') {
        this.stockfishPrompt();
      } else if (answers.prompt === 'lichess') {
        this.lichessPrompt();
      } else if (answers.prompt === 'exit') {
        process.exit(0);
      }
    });
  }

  stockfishPrompt() {
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
        name: 'Find and make best move',
        value: 'best',
        short: 'Best'
      }, {
        name: 'Evaluate current position',
        value: 'eval',
        short: 'Eval position'
      }, {
        name: 'What\'s my best move?',
        value: 'go',
        short: 'Go'
      }, {
        name: 'Set new position',
        value: 'setpos',
        short: 'Set position'
      }, {
        name: 'Settings',
        value: 'settings',
        short: 'Settings'
      }, {
      //   name: 'Ponder responses to my opponents best move',
      //   value: 'ponder',
      //   short: 'Ponder'
      // }, {
        name: 'Go back to main menu',
        value: 'exit',
        short: 'exit'
      }]
    }], (answers) => {
      if (answers.operation === 'exit') {
        this.basePrompt();
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
      } else if (answers.operation === 'best') {
        this.findAndMakeBestMove();
      } else if (answers.operation === 'settings') {
        this.settingsPrompt();
      }
    });
  }

  lichessPrompt() {
    let self = this;
    inquirer.prompt([{
      type: 'list',
      name: 'operation',
      message: 'What do you want to do?',
      choices: [{
        name: 'Fetch a user',
        value: 'user',
        short: 'User'
      }, {
        name: 'Fetch a user\'s games',
        value: 'usergames',
        short: 'User\'s games'
      }, {
        name: 'Fetch a game',
        value: 'game',
        short: 'game'
      }, {
        name: 'Go back to main menu',
        value: 'exit',
        short: 'exit'
      }]
    }], (answers) => {
      if (answers.operation === 'exit') {
        self.basePrompt();
      } else if (answers.operation === 'user') {
        self.standardPrompt('Which user would you like to search for?', (user) => {
          self.client.getUser(user, null, (err, user) => {
            if (err) console.log(err);
            console.log('User: ', user);
            self.lichessPrompt();
          });
        });
      } else if (answers.operation === 'usergames') {
        self.standardPrompt('Which user would you like to search for?', (user) => {
          self.client.getGamesForUser(user, null, (err, games) => {
            if (err) console.log(err);
            console.log('Games: ', games);
            self.lichessPrompt();
          });
        });
      } else if (answers.operation === 'game') {
        self.standardPrompt('Which game ID would you like to look up?', (id) => {
          self.client.getGameById(id, null, (err, game) => {
            if (err) console.log(err);
            console.log('Game: ', game);
            self.lichessPrompt();
          });
        });
      }
    });
  }

  standardPrompt(message, callback) {
    inquirer.prompt([{
      type: 'input',
      name: 'prompt',
      message: message
    }], (answers) => {
      callback(answers.prompt);
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

  // Launch settings prompt
  settingsPrompt() {
    inquirer.prompt([{
      type: 'list',
      name: 'settings',
      message: 'Select the setting you\'d like to change',
      choices: [{
        name: 'Search depth',
        value: 'searchdepth',
        short: 'Depth'
      }, {
        name: 'Toggle debug mode',
        value: 'debug',
        short: 'Debug'
      }, {
        name: 'Toggle verbose mode',
        value: 'verbose',
        short: 'Verbose'
      }, {
        name: 'Exit to main menu',
        value: 'exit',
        short: 'Exit'
      }]
    }], (answers) => {
      if (answers.settings === 'searchdepth') {
        this.depthPrompt();
      } else if (answers.settings === 'debug') {
        this.debugPrompt();
      } else if (answers.settings === 'verbose') {
        this.verbosePrompt();
      } else if (answers.settings === 'exit') {
        this.basePrompt();
      }
    });
  }

  // Change the search depth setting
  depthPrompt() {
    inquirer.prompt([{
      type: 'input',
      name: 'depth',
      message: 'What depth would you like to search? (1-100)'
    }], (answers) => {
      this.engine.setDepth(answers.depth);
      this.settingsPrompt();
    });
  }

  // Change debug setting
  debugPrompt() {
   inquirer.prompt([{
      type: 'list',
      name: 'debug',
      message: 'Change debug logging setting',
      choices: [{
        name: 'Debug On',
        value: 'debug-on',
        short: 'Debug On'
      }, {
        name: 'Debug Off',
        value: 'debug-off',
        short: 'Debug Off'
      }]
    }], (answers) => {
      let flag = (answers.debug === 'debug-on') ? true : false;
      this.engine.setDebug(flag);
      this.settingsPrompt();
    });
  }

  // Change debug setting
  verbosePrompt() {
   inquirer.prompt([{
      type: 'list',
      name: 'verbose',
      message: 'Change verbose logging setting',
      choices: [{
        name: 'Verbose On',
        value: 'verbose-on',
        short: 'Verbose On'
      }, {
        name: 'Verbose Off',
        value: 'verbose-off',
        short: 'Verbose Off'
      }]
    }], (answers) => {
      let flag = (answers.verbose === 'verbose-on') ? true : false;
      this.engine.setVerbose(flag);
      this.settingsPrompt();
    });
  }

  getLichessUser(username, callback) {
    this.client.getUser(username, null, callback);
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
  findAndMakeBestMove() {
    let self = this;
    self.engine.findAndMakeBestMove(() => {
      self.basePrompt();
    });
  }
}

module.exports = Wizard;