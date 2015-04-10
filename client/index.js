'use strict';

$(document).ready(init);

function init(){

}

var green = "url('/asset/piece_green.jpg')";

function putPieceOn(x, y, color){
  if (color === 'blue'){
  $('tr:nth-child(' + y + ') td:nth-child(' + x + ')').addClass('addBluePiece');
  }
  else {$('tr:nth-child(' + y + ') td:nth-child(' + x + ')').addClass('addGreenPiece');}
}
