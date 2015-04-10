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

function init(){
  $('#start').click(fillBoard);
  $('#reset').click(fillBoard);
}

// var green = "url('/asset/piece_green.jpg')";

function putPieceOn(num, color){
  var x = num.toString()[0];
  var y = num.toString()[1];
  if (color === 'blue'){
  $('tr:nth-child(' + y + ') td:nth-child(' + x + ')').addClass('addBluePiece');
  }
  else {$('tr:nth-child(' + y + ') td:nth-child(' + x + ')').addClass('addGreenPiece');}
}
function fillBoard(){
  for (var key in newBoard){
    if (newBoard[key] !== 'empty') {putPieceOn(key, newBoard[key]);}
  }
}
