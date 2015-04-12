'use strict';

$(document).ready(init);

var current = 'soccer';
var $source;
var flashAction;
var numPieces = {'football':12, 'soccer':12}

function init(){
  initBoard();
  $('#start').click(startGame);
  $('#reset').click(initBoard);
  $('#board').on('click', '.active', select);
  $('#board').on('click', '.empty', move);
}

function initBoard(){
  stopFlash();
  $('.valid').removeClass('soccer football player active empty');
  $('#board tr:lt(3) .valid').addClass('soccer player');
  $('#board tr:gt(4) .valid').addClass('football player');
  $('.valid:not(.player)').addClass('empty');
  flashBoard();
}

function startGame(){
  stopFlash();
  $('.' + current).addClass('active');
  $('.' + current).removeClass('hilight');
}

function switchUser(){
  current = (current === 'football') ? 'soccer' : 'football';
  $('.valid').removeClass('active selected');
  $('.' + current).addClass('active');
}

function flashBoard(){
  // flashAction = setInterval(switchUser, 300);
  flashAction = setInterval(toggleHiLite, 300);
}

function toggleHiLite(){
  current = (current === 'football') ? 'soccer' : 'football';
  $('.valid').removeClass('active selected hilight');
  $('.' + current).addClass('hilight');
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
  compass.south = compass.north * -1;
  compass.north2 = compass.north * 2;
  compass.east2 = compass.east * 2;
  compass.west2 = compass.west * 2;
  compass.south2 = compass.south * 2;
  // debugger;
  switch (moveType(src, tgt, compass, isKing)){
    case 'move':
      movePiece($source, $target);
      switchUser();
      break;
    case'jump':
      // console.log('Its a jump');
      movePiece($source, $target);
      removePiece(src, tgt);
      $source = $target;
      //Check if another jump is possible.  If yes
      //selected() and wait for another move;  If not check if there are any opponent
      //pieces left.

  }
}

function removePiece(src, tgt){
  var x = (src.x + tgt.x)/2 + 1;
  var y = (src.y + tgt.y)/2 + 1;
  $('tr:nth-child(' + y + ') td:nth-child(' + x + ')').removeClass().addClass('valid empty');
  var opponent = (current === 'football')? 'soccer':'football';
  // debugger;
  numPieces[opponent] -= 1;
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
  if (isJump(src, tgt, compass, isKing) && isEnemy($source, (tgt.x - src.x)/2, (tgt.y - src.y)/2)){
    return 'jump';
  }
}

function isMove(src, tgt, compass, isKing){
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) &&
    (src.y + compass.north === tgt.y || (isKing && src.y + compass.south === tgt.y));
}

function isJump(src, tgt, compass, isKing){
  return (src.x + (2*compass.east) === tgt.x || src.x + (2*compass.west) === tgt.x) &&
    (src.y + (2*compass.north) === tgt.y || (isKing && src.y + (2*compass.south) === tgt.y));
}

function isEnemy($source, xdirection, ydirection){
  var src = {};
  var tgt = {};
  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  tgt.x = src.x + xdirection;
  tgt.y = src.y + ydirection;
  var enemy = (current === 'football') ? 'soccer' : 'football';
  if ($('tr:nth-child(' + (tgt.y+1) + ') td:nth-child(' + (tgt.x+1) + ')').hasClass(enemy)){
    return true;
  }
  else {return false;}
}

function isEnemyClose($source, isKing){
  // var src = {};
  // var tgt1 = {};
  // var tgt2 = {};
  var compass = {};
  compass.north = (current === 'football') ? -1 : 1;
  compass.east = (current==='football') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * - 1;

  // src.x = $source.data('x') * 1;
  // src.y = $source.data('y') * 1;
  // tgt1.x = src.x + compass.west;
  // tgt1.y = src.y + compass.north;
  // tgt2.x = src.x + compass.east;
  // tgt2.y = tgt1.y;
  if (isEnemy($source, compass.east, compass.north)) {

  }


  if (isKing){
    // var tgt3 = {};
    // var tgt4 = {};
    // tgt3.x = tgt1.x;
    // tgt4.x = tgt2.x;
    // tgt3.y = src.y + compass.south;
    // tgt4.y = tgt3.y;
  }
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
