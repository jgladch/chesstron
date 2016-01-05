# Chesstron - Chess CLI

#### Powered by Stockfish and Node.js

### About

Chesstron is a command line tool for analyzing and exploring chess games. It exposes an interface to the [Stockfish](https://stockfishchess.org/) chess engine ([currently the strongest chess engine in the world](https://en.wikipedia.org/wiki/Thoresen_Chess_Engines_Competition)) and allows you to evaluate chess positions, make moves, and get feedback on your play. Additionally, it is integrated with [LiChess.org](http://en.lichess.org/) to provide easy access to any LiChess user's games. You can search for lichess games, import them into the engine and analyze them.

Yes, many (if not all) of the features provided by this tool are currently available on LiChess, this tool was created as a labor of love and to provide an [all-javascript](https://github.com/nmrugg/stockfish.js) proof-of-concept implementation of the Stockfish engine.

### Stockfish Engine

You can use the chess engine just like you would any other: set up board positions, get computer recommendations for moves, make moves, evaluate positions, etc. 

![StockfishMode](http://i.imgur.com/p1zMg0K.png "Stockfish")

Chesstron also provides access to [LiChess.org](http://en.lichess.org/) users and games. You can look up any lichess user profile and load their games into the engine for further analysis.

![lichessMode](http://i.imgur.com/F6g9vZH.png "Lichess")

### How to use

#### To download CLI tool for use:
```
  npm install -g chesstron
  chesstron
```

#### To clone repo for development:

```
  git clone https://github.com/jgladch/chesstron.git
  npm install
  chesstron
```

### Contributing

Pull requests will be accepted - there is a lot more we can do with this tool!