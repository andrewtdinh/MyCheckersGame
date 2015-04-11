'use strict';

$(document).ready(init);

var newBoard = {21:'blue', 41:'blue', 61:'blue', 81:'blue',
                12:'blue', 32:'blue', 52:'blue', 72:'blue',
                23:'blue', 43:'blue', 63:'blue', 83:'blue',
                14:'empty', 34:'empty', 54:'empty', 74:'empty',
                25:'empty', 45:'empty', 65:'empty', 85:'empty',
                16:'green', 36:'green', 56:'green', 76:'green',
                27:'green', 47:'green', 67:'green', 87:'green',
                18:'green', 38:'green', 58:'green', 78:'green',};
var currentBoard = newBoard;
var current = 'soccer';
var $source;
var flashAction;

function init(){
  initBoard();
  $('#start').click(startGame);
  $('#reset').click(initBoard);
  $('#board').on('click', '.active', select);
  $('#board').on('click', '.empty', move);
}

function initBoard(){
  $('.valid').removeClass('soccer football player active empty');
  $('#board tr:lt(3) .valid').addClass('soccer player');
  $('#board tr:gt(4) .valid').addClass('football player');
  $('.valid:not(.player)').addClass('empty');
  // $('.valid ')
  flashBoard();
}

function startGame(){
  stopFlash();
}

function switchUser(){
  current = (current === 'football') ? 'soccer' : 'football';
  $('.valid').removeClass('active selected');
  $('.' + current).addClass('active');
}

function flashBoard(){
  flashAction = setInterval(switchUser, 300);
}

function stopFlash(){
  clearInterval(flashAction);
}

function move(){
  if(!$source){
    return;
  }
  var $target = $(this);
  //isKing = $source.hasClass('king'); //we can do this but is is more powerful
  var isKing = $source.is('.king');

  var src = {};
  var tgt = {};

  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;

  var compass = {};
  compass.north = (current === 'football') ? -1 : 1;
  compass.east = (current==='football') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * - 1;
  compass.north2 = (current === 'football') ? -2 : 2;
  compass.east2 = (current==='football') ? 2 : -2;
  compass.west2 = compass.east * -1;
  compass.south2 = compass.north * - 1;

  switch (moveType(src, tgt, compass, isKing)){
    case 'move':
      movePiece($source, $target);
      switchUser();
      break;
    case'jump':
      // console.log('Its a jump');
      movePiece($source, $target);
      removePiece();
      //Check if another jump is possible.  If yes
      //selected() and wait for another move;  If not check if there are any opponent
      //pieces left. 

  }
}

function movePiece($source, $target){
  var targetClasses = $target.attr('class');  //all classes on target
  var sourceClasses = $source.attr('class');
  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);
}

function moveType(src, tgt, compass, isKing){
  if (isMove (src, tgt, compass, isKing)){
    return 'move';
  }
  if (isJump() && isEnemy()){
    return 'jump';
  }
}

function isMove(src, tgt, compass, isKing){
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) &&
    (src.y + compass.north === tgt.y || (isKing && src.y + compass.south === tgt.y));
}

function isJump(){

}

function isEnemy(){

}

function select(){
  $source = $(this);  //--> normal td to jquery td
  $('.valid').removeClass('selected');
  $source.addClass('selected');

}


// function putPieceOn(num, color){
//   var x = num.toString()[0];
//   var y = num.toString()[1];
//   if (color === 'blue'){
//   $('tr:nth-child(' + y + ') td:nth-child(' + x + ')').addClass('addBluePiece');
//   }
//   else {$('tr:nth-child(' + y + ') td:nth-child(' + x + ')').addClass('addGreenPiece');}
// }
// function fillBoard(){
//   for (var key in newBoard){
//     if (newBoard[key] !== 'empty') {putPieceOn(key, newBoard[key]);}
//   }
// }
