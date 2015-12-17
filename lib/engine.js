import stockfish from 'stockfish';
import Logger from './logger';
import _ from 'lodash';
let bestRegex = /bestmove\s+(\S+)/;
let moveRegex = /makemove\s+(\S+)/;

class Engine {
  /**
   * Construct our Engine class
   * @param {Function} initialized The callback to be invoked once the engine boots
   */
  constructor(initialized) {
    let self = this;
    this.engine = stockfish();
    this.logger = new Logger({
      showDebug: true
    });
    
    // Variables to manage state
    this.initializing = true;
    this.position = 'startpos';
    this.last_command;
    this.best_move;
    this.moves = [];

    // Initialize engine to UCI standard
    this.send('uci', () => {
      self.logger.enable();
    });

    // Parse output from Stockfish engine
    this.engine.onmessage = (line) => {
      this.logger.log('Line', line); // Log the output

      // Check if we've just exited initialization, invoke initiliazation callback if so
      if (this.initializing && this.last_command === 'uci' && line.indexOf('uciok') > -1) {
        this.initializing = false;

        // If we have a regular command callback, invoke it and erase it
        if (_.isFunction(this.callback)) {
          this.callback();
          this.callback = null;
        }
        
        // If we have an initialization callback, invoke it
        if (_.isFunction(initialized)) {
          this.logger.debug('Invoking initiliazation callback!');
          initialized();
        }

      } else if (this.isFinished(line)) { // If we've just finished an engine command
        this.logger.debug('Line finished!');

        if (_.isFunction(this.callback)) { // If we have a callback, invoke it
          this.logger.debug('We\'ve got a callback and we\'re not afraid to use it');
          this.callback();
          this.callback = null;
        }
      }
    }
  }

  /**
   * Send a message to the Stockfish engine
   * @param {String} command The UCI-compatible command to feed the engine
   * @param {Function} callback (Optional) The callback to invoke upon completion
   */
  send(command, callback) {
    if (_.isFunction(callback)) {
      this.logger.debug('Setting command callback');
      this.callback = callback;
    } else if (!_.isFunction(callback) && !!this.callback) { // Clear any callbacks from previous commands
      this.logger.debug('No callback set, removing any previous command callbacks');
      this.callback = null;
    }

    // Check if we're sending in our custom `makemove` command, handle specially
    if (_.contains(command, 'makemove')) {
      const move = moveRegex.exec(command)[1];
      this.moves.push(move);
      command = `position ${this.position} moves ${this.moves.join(' ')}`;
    }

    this.logger.log('Sending', command); // Output command to console
    this.last_command = command; // Save last command
    this.engine.postMessage(command); // Send command to engine

    // Handle special case of `position` command, immediately invoke callback
    if (command.indexOf('position ') === 0) {
      this.logger.debug('Invoking callback immediately for position change');
      this.parsePositionChange(command); // Parse position change, save state
      if (_.isFunction(callback)) {
        callback();
        this.callback = null;
      }
    }
  }

  /**
   * Parse output from engine, check if command has finished
   * @param {String} line The engine output string to parse
   * @returns {Boolean}
   */
  isFinished(line) {
    if (this.last_command === 'd' && line.indexOf('Legal uci moves') > -1) {
      return true;
    } else if (this.last_command === 'eval' && line.indexOf('Total Evaluation:') > -1) {
      return true;
    } else if (line.indexOf('bestmove') > -1) {
      let match = bestRegex.exec(line)[1];
      if (match) { // Parse the bestmove from engine output
        this.best_move = match;
        this.logger.log('Best', match);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Parse the position change command to save FEN and individual moves
   * @param {String} command The command to parse
   */
  parsePositionChange(command) {
    if (!_.contains(command, 'moves')) { // If command doesn't have moves, just save position
      const fen = command.slice(9);
      this.logger.debug('Parsed position: ', fen);
      this.position = fen;
    } else {
      const moveIndex = command.indexOf('moves');
      const fen = command.slice(9, moveIndex);
      let moves = command.slice(moveIndex + 6);
      moves = moves.split(' ');
      this.logger.debug('Parsed position: ', fen);
      this.logger.debug('Parsed moves: ', moves);
      this.position = fen;
      this.moves = moves;
    }
  }
}

module.exports = Engine;