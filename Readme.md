# Chesstron - Chess CLI

#### Powered by Stockfish and Node.js

![LiChess](http://apkplz.com/storage/images/org/lichess/mobileapp/170/lichess-free-online-chess.png "Lichess")

![GUI](http://i.imgur.com/XqUbtsb.png "GUI")

### About

Two things about me: I love chess and I love building things with computers. This pet project is a labor of love and an all-javascript proof-of-concept.

Chesstron is a command line tool which gives you convenient access to an [all-javascript](https://github.com/nmrugg/stockfish.js) implementation of the [Stockfish](https://stockfishchess.org/) Open Source Chess Engine, [currently the strongest chess engine in the world](https://en.wikipedia.org/wiki/Thoresen_Chess_Engines_Competition).

The tool provides an easy to use GUI that allow you change positions, make moves, request computer help, and much more.

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

Pull requests will be accepted