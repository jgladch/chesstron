import stockfish from 'stockfish';
import Logger from './logger';

class Engine {
  constructor(callback) {
    this.initializing = true;
    this.engine = stockfish();
    this.position = 'startpos';
    this.thinking = false;
    this.last_command;
    this.logger = new Logger();

    this.send('uci');

    this.engine.onmessage = (line) => {
      this.logger.log('Line', line);

      if (this.initializing && this.last_command === 'uci' && line.indexOf('uciok') > -1) {
        // Invoke callback after initialization
        this.initializing = false;
        this.thinking = false;
        callback();
      } else if (this.last_command === 'uci' && line.indexOf('uciok') > -1) {
        this.thinking = false;
      } else if (this.last_command === 'd' && line.indexOf('Legal uci moves') > -1) {
        this.thinking = false;
      } else if (this.last_command === 'eval' && line.indexOf('Total Evaluation:') > -1) {
        this.thinking = false;
      }
    }
  }

  send(message) {
    this.thinking = true;
    this.last_command = message;
    this.logger.log('Sending', message);
    this.engine.postMessage(message);
  }
}

module.exports = Engine;