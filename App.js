import React, { Component, useState } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  TouchableHighlight,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import Constants from 'expo-constants';
import PropTypes from 'prop-types';
const { Chess } = require('./chess.js');

// You can import from local files

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
//https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
//https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
let squareHeight = deviceWidth / 8;
let chess = new Chess();

const Board = (props) => {
  return props.board.map((element) => (
    <View style={{ flexDirection: 'row', height: squareHeight }}>
      {element.map((item) => (
        <Square
          color={item.color}
          pieceID={item.pieceID}
          isClickable={item.isClickable}
          key={item.key}
          name={item.name}
        />
      ))}
    </View>
  ));
};

const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
//            black, white, selected, tinted
const colors = ['#769656', '#eeeed2', 'green', 'yellow'];
const wNameFEN = ['p', 'n', 'b', 'r', 'q', 'k'];
const bNameFEN = ['P', 'N', 'B', 'R', 'Q', 'K'];
const pieceName = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
const wpURL = [
  'https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png',
];
const bpURL = [
  'https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png',
  'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png',
];
const epURL = 'https://upload.wikimedia.org/wikipedia/commons/2/20/16x16.png';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
let NSboard = [];
let prevPieceID = '';
let prevPieceMoves = [];
export default class App extends Component {
  //https://reactnative.dev/docs/props
  //https://reactnative.dev/docs/state
  //https://github.com/halilb/react-native-chess/blob/master/src/components/board/Board.js
  //https://www.youtube.com/watch?v=JulJJxbP_T0
  //rules open source utility called chess.js || import { Chess } from 'chess.js';
  //https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/season4/src/Chess/Board.tsx

  state = {
    PieceID: 'https://upload.wikimedia.org/wikipedia/commons/2/20/16x16.png',
    Board: [[]],
    FEN: startFEN,
    Pages: ['block', 'none'],
    PageNumber: 0,
    pieceType: 3,
  };

  changePage = (pageNumber) => {
    let list = this.state.Pages;
    list[this.state.PageNumber] = 'none';
    list[pageNumber] = 'block';
    this.setState({
      PageNumber: pageNumber,
      Pages: list,
    });
  };

  changeTitlePieceType = () => {
    if (this.state.pieceType + 1 == wpURL.length) {
      this.setState({ pieceType: 0 });
    } else {
      this.setState({ pieceType: this.state.pieceType + 1 });
    }
  };

  resetBoard = () => {
    chess = new Chess(startFEN);
    NSboard = [0, 1, 2, 3, 4, 5, 6, 7];

    for (let j = 7; j >= 0; j--) {
      let row = [0, 1, 2, 3, 4, 5, 6, 7];
      for (let i = 0; i < 8; i++) {
        row[i] = {
          key: letters[i] + (j + 1),
          name: letters[i] + (j + 1),
          color: colors[(1 + i + j) % 2],
          pieceName: '',
          pieceColor: '',
          pieceID:
            'https://upload.wikimedia.org/wikipedia/commons/2/20/16x16.png',
          isClickable: true,
        };
        //console.log('build square ' + row[i].name);
      }
      NSboard[j] = row;
    }
    this.setFEN(startFEN);
  };

  updateBoard = () => {
    this.changeKey();
    console.log(NSboard[0][0].key);
    this.setState({ Board: NSboard });
    console.log('updated');
  };

  changeKey = () => {
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        NSboard[i][j].key = NSboard[i][j].key + 'L';
      }
    }
  };

  test = () => {
    //console.log(this.state.Board);
    //console.log(NSboard);
    //console.log(this.state.Board === NSboard);
    this.updateBoard();
    //setTimeout(function(){ alert("After 5 seconds!"); }, 100);
  };
  //goes through each piece in the board and asigns the apropiate image
  setFEN = (fen) => {
    let fenlist = fen.split('/');
    let fenEnd = fenlist[7].split(' ');
    //fenlist = fenEnd(0);
    fenlist.pop();
    fenlist = fenlist.concat(fenEnd);
    console.log('fen list form ' + fenlist);

    for (let i = 0; i < 8; i++) {
      let line = fenlist[7 - i];
      let J = 0;
      //console.log(line);

      for (let j = 0; j < line.length; j++) {
        let char = line.charAt(j);
        let wID = wNameFEN.indexOf(char);
        let bID = bNameFEN.indexOf(char);

        if (wID != -1) {
          NSboard[i][J].pieceID = wpURL[wID];
          NSboard[i][J].pieceName = pieceName[wID];
          NSboard[i][J].pieceColor = 'white';
          //board[i][J].isClickable = true;
          J++;
          //console.log('    white' + char + ' added to ' + i + J);
        } else if (bID != -1) {
          NSboard[i][J].pieceID = bpURL[bID];
          NSboard[i][J].pieceName = pieceName[wID];
          NSboard[i][J].pieceColor = 'black';
          J++;
          //console.log('    black' + char + ' added to ' + i + J);
        } else {
          for (let k = 0; k < char; k++) {
            NSboard[i][J].pieceID = epURL;
            NSboard[i][J].pieceName = '';
            NSboard[i][J].pieceColor = '';
            J++;
          }
        }
      }
    }
    console.log('sucessfully set to fen');
    //console.log(NSboard);
  };

  highlight = (key, color) => {
    let startI = key.length - 2;
    let column = letters.indexOf(key.substring(startI, startI + 1));
    let row = key.substring(startI + 1, startI + 2) - 1;
    //console.log(row + ' ' + column);
    NSboard[row][column].color = color;
    //console.log('color changed to ' + color + ' at ' + key);
  };
  unHighlight = (key) => {
    let startI = key.length - 2;
    let column = letters.indexOf(key.substring(startI, startI + 1));
    let row = key.substring(startI + 1, startI + 2) - 1;
    //console.log(row + ' ' + column);
    //console.log(colors[((column + row) % 2)]);
    NSboard[row][column].color = colors[(column + row + 1) % 2];
    //console.log('color reset at ' + key);
  };
  highlightNewPieces = (key, moves) => {
    //console.log(prevPieceID.length > 0);
    //console.log(prevPieceID);
    if (prevPieceID.length > 0) {
      this.unHighlight(prevPieceID);
    }
    if (prevPieceMoves.length > 0) {
      for (let x in prevPieceMoves) {
        this.unHighlight(prevPieceMoves[x]);
      }
    }

    this.highlight(key, colors[2]);
    for (let x in moves) {
      this.highlight(moves[x], colors[3]);
    }
    this.updateBoard();
  };
  unHighlightPieces = () => {
    this.unHighlight(prevPieceID);
    for (let x in prevPieceMoves) {
      this.unHighlight(prevPieceMoves[x]);
    }
    this.updateBoard();
  };

  Select = (key) => {
    console.log('tile ' + key + ' pressed');

    let found = false;
    for (let i = 0; i < prevPieceMoves.length; i++) {
      //console.log(key === prevPieceMoves[i]);
      if (key === prevPieceMoves[i].substring(prevPieceMoves[i].length - 2)) {
        chess.move({ from: prevPieceID, to: key });
        console.log(prevPieceID + ' moves to ' + key);
        found = true;
        //console.log(chess.fen());
        this.setFEN(chess.fen());
        this.updateBoard();
        break;
      }
    }
    if (!found) {
      let moves = chess.moves({ square: key });
      this.highlightNewPieces(key, moves);
      prevPieceID = key;
      prevPieceMoves = moves;
      console.log('moves of this piece: ' + prevPieceMoves);
    } else {
      //console.log('reset prevPiece');
      this.unHighlightPieces();
      prevPieceID = '';
      prevPieceMoves = [];
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.titleHeader}>
            <TouchableHighlight
              onPress={() => {
                this.changeTitlePieceType();
              }}>
              <Image
                source={{ uri: wpURL[this.state.pieceType] }}
                style={styles.titleHeaderIcon}
              />
            </TouchableHighlight>

            <View style={styles.titleHeaderTextBox}>
              <Text style={styles.titleHeaderText}>Chess</Text>
            </View>

            <TouchableHighlight
              onPress={() => {
                this.changeTitlePieceType();
              }}>
              <Image
                source={{ uri: bpURL[this.state.pieceType] }}
                style={styles.titleHeaderIcon}
              />
            </TouchableHighlight>
          </View>

          <View>
            <View style={{ display: this.state.Pages[1] }}>
              <View style={styles.gameCenterBox}>
                <View style={styles.gameSpacer} />
                <View style={styles.boardBox}>
                  <Board board={this.state.Board} />
                </View>
                <View style={styles.gameSpacer} />
                <TouchableHighlight
                  onPress={() => {
                    this.test();
                  }}>
                  <View style={styles.refreshButton}>
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>

            <View style={{ display: this.state.Pages[0] }}>
              <View style={styles.titleCenterBox}>
                <View style={styles.gameSpacer} />
                <View style={styles.titleCenterTextBox}>
                  <Text style={styles.titleCenterText}>
                    Currently there are a lot of errors with the chess aspect of
                    this app, including but not limited to: Refreshing the page
                    has to be done manually, the highlighting of certain moves
                    messes up, pawns cannot move to the end of the board, etc.
                  </Text>
                </View>
                <View style={styles.titleCenterTextBox}>
                  <Text style={styles.titleCenterText}></Text>
                </View>
                <View style={styles.gameSpacer} />
              </View>
            </View>
          </View>

          <View style={styles.titleFooter}>
            <TouchableHighlight
              onPress={() => {
                this.resetBoard();
                this.updateBoard();
                this.changePage(1);
              }}>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>New Game</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}
//https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate
//https://reactnativeforyou.com/how-to-use-map-function-in-react-native/
class Square extends Component {
  constructor(props) {
    super(props);
  }

  Select = () => {
    //Calling a function of other class (with argument)
    new App().Select(this.props.name);
  };
  updateBoard = () => {
    //Calling a function of other class (with argument)
    new App().updateBoard();
    //new App().setState({ Board: NSboard })
  };
  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          if (this.props.isClickable) {
            this.Select();
            //this.updateBoard();
            setTimeout(function () {
              //this.updateBoard()
              console.log('reeee');
            }, 1000);
          }
        }}
        style={{ height: squareHeight, width: squareHeight }}>
        <View
          style={{
            backgroundColor: this.props.color,
            height: squareHeight,
            width: squareHeight,
          }}>
          <Image
            source={{ uri: this.props.pieceID }}
            style={{ height: squareHeight, width: squareHeight }}
          />
        </View>
      </TouchableHighlight>
    );
  }
  static propTypes = {
    color: PropTypes.color,
    pieceID: PropTypes.string,
    isClickable: PropTypes.boolean,
    key: PropTypes.string,
    name: PropTypes.string,
  };
}

const styles = StyleSheet.create({
  container: {
    height: deviceHeight,
    width: deviceWidth,
    backgroundColor: colors[1],
  },

  // Title Page

  titleHeader: {
    height: deviceWidth / 5,
    width: deviceWidth,
    flexDirection: 'row',
    backgroundColor: colors[0],
  },
  titleHeaderIcon: {
    height: deviceWidth / 5,
    width: deviceWidth / 5,
  },
  titleHeaderTextBox: {
    height: deviceWidth / 5,
    width: (3 * deviceWidth) / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHeaderText: {
    fontSize: deviceWidth / 5,
    textAlign: 'center',
    color: colors[1],
  },

  titleCenterBox: {
    height: deviceHeight - (2 * deviceWidth) / 5,
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  titleCenterTextBox: {
    width: deviceWidth - 100,
  },

  titleFooter: {
    backgroundColor: colors[0],
    height: deviceWidth / 5,
    width: deviceWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: colors[1],
    height: (2 * deviceWidth) / 15,
    width: (3 * deviceWidth) / 5,
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: 'center',
  },
  startButtonText: {
    color: colors[0],
    fontSize: deviceWidth / 10,
    textAlign: 'center',
  },

  gameCenterBox: {
    height: deviceHeight - (2 * deviceWidth) / 5,
    width: deviceWidth,
    alignItems: 'center',
  },
  gameSpacer: {
    height: deviceWidth / 10,
  },
  boardBox: {
    borderTopWidth: 5,
    borderBottomWidth: 5,
  },
  refreshButton: {
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: colors[0],
    height: deviceWidth / 8,
    width: deviceWidth / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: colors[1],
    textAlign: 'center',
    fontSize: deviceWidth / 20,
  },
});
