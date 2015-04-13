'use strict';

$(document).ready(init);

var current = 'soccer';
var $source;
var flashAction;
var numPieces = {'football':12, 'soccer':12};

function init(){
  initBoard();
  $('#start').click(startGame);
  $('#reset').click(initBoard);
  $('#board').on('click', '.active', select); //change .active to .allowSelect
  $('#board').on('click', '.empty', move);
}

function initBoard(){
  stopFlash();
  $('.valid').removeClass('soccer football player active empty king soccerking footking selected');
  $('#board tr:lt(3) .valid').addClass('soccer player');
  $('#board tr:gt(4) .valid').addClass('football player');
  $('.valid:not(.player)').addClass('empty');
  flashBoard();
}

function startGame(){
  stopFlash();
  $('.' + current).addClass('active');
  $('.' + current).removeClass('hilight');
  //For each of active pieces, look for and add class allowSelect
}

function switchUser(){
  current = (current === 'football') ? 'soccer' : 'football';
  $('.valid').removeClass('active selected');
  $('.' + current).addClass('active');
  //For each of active pieces, look for and add class allowSelect
}

//moveAvailable function to be defined

function flashBoard(){
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

function crown($target){
  if (current === 'football'){
    $target.addClass('king footking');
  } else {
    $target.addClass('king soccerking');
  }
}
function touchDown($target){
  if ((current === 'football') && (($target.y * 1) === 0)) {return true;}
  else if ((current === 'soccer') && (($target.y * 1) === 7)) {return true;}
  else {return false;}
}


function move(){
  if(!$source){
    return;
  }

  var $target = $(this);
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
  switch (moveType(src, tgt, compass, isKing)){
    case 'move':
      movePiece($source, $target);
      switchUser();
      break;
    case'jump':
      movePiece($source, $target);
      removePiece(src, tgt);
      $source = $target;
      if (canJump($source, isKing)){return;}
      else {
        var opponent = (current === 'football')? 'soccer':'football';
        if (numPieces[opponent] === 0) {
          if (current === 'football'){
            alert('Meanie Greenies have conquered the world...for now!!');
          } else {
            alert('Stitchilions have conquered the world...for now!!');
          }
        }
        else {switchUser();}
      }
  }
}

function removePiece(src, tgt){
  var x = (src.x + tgt.x)/2 + 1;
  var y = (src.y + tgt.y)/2 + 1;
  $('tr:nth-child(' + y + ') td:nth-child(' + x + ')').removeClass().addClass('valid empty');
  var opponent = (current === 'football')? 'soccer':'football';
  numPieces[opponent] -= 1;
}
function movePiece($source, $target){
  var targetClasses = $target.attr('class');  //all classes on target
  var sourceClasses = $source.attr('class');
  debugger;
  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);

  $target.data('y') === 0 ? $target.addClass('king footking'): console.log('Not crowned!');
  $target.data('y') === 7 ? $target.addClass('king soccerking'): console.log('Not crowned');
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

function canJumpTo($source, xdirection, ydirection){
  var src = {};
  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  var x = src.x + xdirection + 1;
  var y = src.y + ydirection + 1;
  if ($('tr:nth-child(' +y+ ') td:nth-child(' +x+ ')').hasClass('empty')){
    return true;
  }
  else {return false;}
}

function canMoveTo($source, xdirection, ydirection){
  var src = {};
  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  var x = src.x + xdirection + 1;
  var y = src.y + ydirection + 1;
  if ($('tr:nth-child(' +y+ ') td:nth-child(' +x+ ')').hasClass('empty')){
    return true;
  }
  else {return false;}
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

function canMove($source, isKing){
  var compass = {};
  compass.north = (current === 'football') ? -1 : 1;
  compass.east = (current==='football') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;
  if (canMoveTo($source, compass.east, compass.north)) {
    return true;
  }
  if (canMoveTo($source, compass.west, compass.north)) {
    return true;
  }
  if (isKing){
    if (canMoveTo($source, compass.east, compass.south)){
      return true;
    }
    if (canMoveTo($source, compass.west, compass.south)){
      return true;
    }
  }
  return false;
}

function canJump($source, isKing){
  var compass = {};
  compass.north = (current === 'football') ? -1 : 1;
  compass.east = (current==='football') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;
  compass.north2 = compass.north * 2;
  compass.east2 = compass.east * 2;
  compass.west2 = compass.west * 2;
  compass.south2 = compass.south * 2;
  if (isEnemy($source, compass.east, compass.north) && canJumpTo($source, compass.east2, compass.north2)) {
    return true;
  }
  if (isEnemy($source, compass.west, compass.north) && canJumpTo($source, compass.west2, compass.north2)) {
    return true;
  }
  if (isKing){
    if (isEnemy($source, compass.east, compass.south) && canJumpTo($source, compass.east2, compass.south2)){
      return true;
    }
    if (isEnemy($source, compass.west, compass.south) && canJumpTo($source, compass.west2, compass.south2)){
      return true;
    }
  }
  return false;
}

function select(){
  $source = $(this);  //--> normal td to jquery td
  $('.valid').removeClass('selected');
  $source.addClass('selected');
}

function isKing(){
  return $source.hasClass('king');
}
