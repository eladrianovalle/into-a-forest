/* CURRENTLY IN: javascript/main.js */
var GameBoard = (function(){
  // private variables here
	var _gameboard, _currentPos, _boardDim;

	// private methods here
	function _createEmptyArray( n, ar ) {
		for( var i = 0;  i < n; i++ ) {
			ar.push( {} );
		}
		return ar;
	}

	// public functions here
	/*
	* creates a game board of dim => n
	*/
	
	function createGameBoard( n ) {
		_gameboard = [];
		_boardDim = n;

		for ( var i = 0; i < n; i++ ) {
			var curr = _createEmptyArray( n, [] );
			_gameboard.push( curr );
		}
	}

	/*
	* string representation of gameboard
	*/

	function getGameBoard() {
		var str = "";
		for ( var i = 0; i < _boardDim; i++ ) {
			str += "Row "+i+" [";
			for( var j = 0; j < _boardDim; j++ ) {
				var obj = getBoardObject( i, j )
				, objStr = " [";
				for ( var objItem in obj ) {
					objStr += objItem + ": " + obj[ objItem ] + ", ";
				}
				objStr += "]";
				if ( j === _boardDim-1 ) {
					objStr += " ";
				} else {
					objStr += ", ";
				}
				str += objStr;
			}
			str += "]\n ";
		}

		return str;
	}

	function getBoardObject( x, y ) {
		if ( typeof _gameboard[ x ] === "undefined" ) {
			return -1;
		} // if invalid x
		if ( typeof _gameboard[ y ] === "undefined" ) {
			return -1;
		} // if invalid y

		return _gameboard[ x ][ y ];

	} // get gameBoardObject

	function setBoardObject( x, y, obj, force ) {
		if ( getBoardObject(x, y) === -1 ) {
			return -1;
		}

		if (
			isBoardObjectSet( x, y ) === true 
			&& force !== 1
		) {
			return -1;
		}

		_gameboard[ x ][ y ] = obj;
	} // set board object

	function isBoardObjectSet( x, y ) {
		var obj = getBoardObject( x, y );
		if ( obj === -1 ) {
			return true;
		}

		var keys = Object.keys( obj );
		if ( keys.length === 0 ) {
			return false;
		}
		return true;
	}

	function getRandomBoardPoint() {
		var x = Math.floor( Math.random()*_boardDim ),
		y = Math.floor( Math.random()*_boardDim );

		return {
			x: x,
			y: y
		};
	} // get random board point

	function clearGameBoard() {
		_gameboard = [];

		createGameBoard( _boardDim );

	}

	function renderBoard() {
		var board = $('.board');
		board.empty();
		for ( var i = 0; i < _boardDim; i++ ) {
			var div = $('<div class="board-row"/>');
			for ( var j = 0; j < _boardDim; j++ ) {
						var boardObject =	$('#' + getBoardObject(i, j).type).html();

				if ( !isBoardObjectSet(i,j) ) {
					var forestType = randomForest();
					boardObject = $('#' + forestType).html();
				} 

				function randomForest(){
							var forestTypes = [
									'theForest'
									// , 'theForestOdd'
									// , 'theForestTop'
									// , 'theForestBottom'
									];
							var random = Math.floor(Math.random() * 1);
							
							return forestTypes[random]
				}
				div.append(boardObject);
			}
			board.append(div)
		}
		var boardPiece = $('.board-piece')
				, boardRow = $('.board-row')
				, dimPercentage = 75/_boardDim + '%';
		boardPiece.css("width", dimPercentage);
		boardPiece.css("height", dimPercentage);
	}

	// populate this object with the
	// things you want to return!
	return {
		createGameBoard: createGameBoard,
		getBoardObject: getBoardObject,
		setBoardObject: setBoardObject,
		isBoardObjectSet: isBoardObjectSet,
		getRandomBoardPoint: getRandomBoardPoint,
		getGameBoard: getGameBoard,
		clearGameBoard: clearGameBoard,
		renderBoard: renderBoard
	}; // return
})();
// End Gameboard Module

/*
 *
 * Player Creation Module
 *
 */

function createGamePlayer( type ) {
	var randomPoint = GameBoard.getRandomBoardPoint()
		, gamePlayerObj = {};

	while ( GameBoard.isBoardObjectSet( randomPoint.x, randomPoint.y ) ) {
		randomPoint = GameBoard.getRandomBoardPoint();
	} 

	gamePlayerObj.type = type;
	gamePlayerObj.x = randomPoint.x;
	gamePlayerObj.y = randomPoint.y;


	GameBoard.setBoardObject(
		gamePlayerObj.x
		, gamePlayerObj.y
		, gamePlayerObj
	);


	return gamePlayerObj;



} // createGamePlayer

// End Player Creation Module

/*
 *
 * Control Module
 *
 */

function move( gamePlayer, x, y ) {
	var currX = gamePlayer.x
		, currY = gamePlayer.y;

	if ( y === 1 ) {
		currX--;
	}
	if ( y === -1 ){
		currX++;
	}
	if ( x === 1 ){
		currY--;
	}
	if ( x === -1 ){
		currY++;
	}

	var isNewPositionOccupied = GameBoard.isBoardObjectSet( currX, currY );

	if ( isNewPositionOccupied ) {
		return {
			moveAttemptX: currX
			, moveAttemptY: currY
			, gameBoardObject: GameBoard.getBoardObject( currX, currY )
		};
	}

	GameBoard.setBoardObject(gamePlayer.x, gamePlayer.y, {}, 1);
	GameBoard.setBoardObject(currX, currY, gamePlayer);

	if ( y === 1 ) {
		gamePlayer.x--;
	}
	if ( y === -1 ){
		gamePlayer.x++;
	}
	if ( x === 1 ){
		gamePlayer.y--;
	}
	if ( x === -1 ){
		gamePlayer.y++;
	}
} // move

// End Control Module



/*
 *
 * Game Module
 *
 */



// recipe
// create game board 
// place enemy, exit, and player
// at a random point
var playButton = $('.play')
		, controls = $('.controls')
		, footer = $('.footer');

playButton.on('click', function(){

	GameBoard.createGameBoard( 5 );
	var Enemy = createGamePlayer( 'theEnemy' )
		, Exit = createGamePlayer( 'theGirl' )
		, Player = createGamePlayer( 'theKnight' );
	
	footer.addClass('hide');
	playButton.addClass('hide');
	controls.addClass('hide');

	GameBoard.renderBoard();

/*
 *
 * Enemy Move Module
 *
 */

function EnemyMove(P, E) {
	console.log( P, E );
	var dX = Math.abs( P.x - E.x )
			, dY = Math.abs( P.y - E.y )
			, moveResults
			, deltaX = 0, deltaY = 0;


	// we want the smaller difference
	if ( dY > dX ) {
		// change y
		console.log('y will change')
		// reduce Y
			if ( E.y > P.y ) {
				// E.y = E.y - 1;
				moveResults = move( E, 1, 0 );
				delatX = 1;

				console.log( 'E.y down 1' );
			} else {
				// E.y = E.y + 1;
				moveResults = move( E, -1, 0 );
				delatX = -1;

				console.log( 'E.y up 1' );
			}
	} else if ( dY < dX ) {
		// change x
		console.log( 'x will change' );
			// 	// reduce X
			if ( E.x > P.x ) {
				// E.x = E.x - 1;
				moveResults = move( E, 0, 1 );
				deltaY = 1;

				console.log( 'E.x down 1' );
			} else {
				// E.x = E.x + 1;
				moveResults = move( E, 0, -1 );
				deltaY = -1;
				console.log( 'E.x up 1' );
			}
	} else if ( dY === dX ) {
		console.log( 'both same')
		if ( E.x > P.x ) {
				// E.x = E.x - 1;
				moveResults = move( E, 0, 1 );
				deltaY = 1;
				console.log( 'E.x down 1' );
			} else {
				// E.x = E.x + 1;
				moveResults = move( E, 0 , -1 );
				deltaY = -1;
				console.log( 'E.x up 1' );
			}
	}

	if ( typeof moveResults !== "undefined" ) {
		console.log('#############')
		var isSet = GameBoard.isBoardObjectSet( E.x-deltaX, E.y-deltaY );
		console.log( isSet, E.x-deltaX, E.y-deltaY );
		console.log( GameBoard.getBoardObject(E.x-deltaX, E.y-deltaY));
		console.log( moveResults )

		if ( moveResults.gameBoardObject.type !== "theKnight" ) return;

		GameBoard.setBoardObject(
				E.x
				, E.y
				, {}
				, 1
			);

			GameBoard.setBoardObject(
				moveResults.moveAttemptX
				, moveResults.moveAttemptY
				, {}
				, 1
			);

			GameBoard.setBoardObject(
				moveResults.moveAttemptX
				, moveResults.moveAttemptY
				, E
				, 1
			);
		console.log('#############')
		// PUT LOGIC TO TELL USER S/HE LOST HERE
		// might want to disable the game as well here...
	}
	GameBoard.renderBoard();
	console.log( E.x, E.y );
}

/*
 *
 * Player Move Module
 *
 */

$(document).keypress(function(e){
	var moveResults;
	console.log(e.keyCode)
	if ( e.keyCode === 119 ) {
		moveResults = move(Player, 0, 1);
		GameBoard.renderBoard();
		setTimeout(function(){EnemyMove(Player, Enemy)}, 500);
	} // w = UP
	if ( e.keyCode === 97) {
		moveResults = move(Player, 1, 0);
		GameBoard.renderBoard();
		setTimeout(function(){EnemyMove(Player, Enemy)}, 500);
	} // a = LEFT
	if ( e.keyCode === 100 ) {
		moveResults = move(Player, -1, 0);
		GameBoard.renderBoard();
		setTimeout(function(){EnemyMove(Player, Enemy)}, 500);
	} // d = RIGHT
	if ( e.keyCode === 115 ) {
		moveResults = move(Player, 0, -1);
		GameBoard.renderBoard();
		setTimeout(function(){EnemyMove(Player, Enemy)}, 500);
	} // s = DOWN
console.log( moveResults );
	if ( typeof moveResults !== "undefined" ) {
		// if the board object is NOT the girl
		// then we want to respect the rules of the gameboard
		// and NOT overwrite the object
		console.log( moveResults )
		if ( moveResults.gameBoardObject.type !== "theGirl" ) return;

		console.log('HERE'); console.log( Player )
		// if it IS the girl
		GameBoard.setBoardObject(
				Player.x
				, Player.y
				, {}
				, 1
			);

			GameBoard.setBoardObject(
				moveResults.moveAttemptX
				, moveResults.moveAttemptY
				, {}
				, 1
			);

			GameBoard.setBoardObject(
				moveResults.moveAttemptX
				, moveResults.moveAttemptY
				, Player
				, 1
			);
			GameBoard.renderBoard();
		console.log('#############')
	}
});

});
/*
 *
 * Enemy Move Module
 *
 */




