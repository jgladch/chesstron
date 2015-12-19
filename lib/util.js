module.exports.createTimedCommand = (command, time, self) => {
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

module.exports.safeFen = (string) => {
  if (!string) {
    return '';
  } else if (string.indexOf('fen ') !== 0) {
    return `fen ${string}`;
  } else {
    return string;
  }
};