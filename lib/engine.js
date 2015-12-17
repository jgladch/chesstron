import stockfish from 'stockfish';
import Logger from './logger';
import _ from 'lodash';

class Engine {
  constructor(callback) {
    this.engine = stockfish();
    this.logger = new Logger();
    
    this.initializing = true;
    this.position = 'startpos';
    this.last_command;

    // Initialize engine to UCI standard
    this.send('uci');

    this.engine.onmessage = (line) => {
      this.logger.log('Line', line);

      // Check if we've just exited initialization, invoke callback if so
      if (this.initializing && this.last_command === 'uci' && line.indexOf('uciok') > -1) {
        this.initializing = false; // We're no longer initializing
        
        if (_.isFunction(callback)) {
          this.logger.debug('Callback!');
          callback();
        }

      } else if (this.isFinished(line)) {
        this.logger.debug('Line finished!');

        if (_.isFunction(this.callback)) {
          this.logger.debug('We\'ve got a callback and we\'re not afraid to use it');
          this.callback();
          this.callback = null;
        }
      }
    }
  }

  send(message, callback) {

    if (_.isFunction(callback)) {
      this.logger.debug('Callback set');
      this.callback = callback;
    } else { // Clear any callbacks from previous commands
      this.logger.debug('No callback set');
      this.callback = null;
    }

    this.last_command = message;
    this.logger.log('Sending', message);
    this.engine.postMessage(message);

    if (message.indexOf('position ') === 0) {
      this.logger.debug('Invoking callback immediately for position change');
      if (_.isFunction(callback)) {
        callback();
        this.callback = null;
      }
    }
  }

  isFinished(line) {
    if (this.last_command === 'd' && line.indexOf('Legal uci moves') > -1) {
      return true;
    } else if (this.last_command === 'eval' && line.indexOf('Total Evaluation:') > -1) {
      return true;
    } else if (line.indexOf('bestmove') > -1) {
      let match = line.match(/bestmove\s+(\S+)/);
      if (match) {
        this.logger.log('Best', match);
      }
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Engine;