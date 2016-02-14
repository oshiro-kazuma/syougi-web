
//TODO 二歩チェックが未実装

//名前空間の定義
var board = {};

// 持ち駒を選択
board.onClickCapturedPiece = function(i, player) {
  if (board.isChoiceMode == false) {
    choiceCapturedPiece(i, player);
  } else {
    board.isChoiceMode = false;
    drawClearMovableSquare();
  }
};

// マスを選択
board.onClickSquare = function(i,j) {
  if (board.isChoiceMode == false) {
    choicePiece(i,j);
  } else if (isDoublePawn(i, j) == true) {
    board.isChoiceMode = false;
    drawClearMovableSquare()
    alert("二歩です")
  } else {
    board.isChoiceMode = false;
    drawClearMovableSquare()

    if(isMovable(i,j)) {
      playSound();

      //もち駒の場合
      if(board.selectedPiece.isCapturedPiece == true) {
        moveCapturedPiece(i, j);
      } else {
        if(isWin(i,j)) board.checkmate("win")
        robPieceIfNeed(i,j);
        movePiece(i,j);
      }
      
      turnEnd();
    }
  }
};

var isDoublePawn = function(i, j) {
  var doublePawn = false
  if(board.capturedPiece[board.player.direction][board.selectedPiece.i] == "歩") {
    [0,1,2,3,4,5,6,7,8].forEach(function(count) {
      var square = board.square[i][count]
      if(square.direction == board.player.direction && square.piece == "歩") {
        doublePawn = true
      }
    })
  }
  return doublePawn;
}

var isWin = function(i, j) {
  return (board.square[i][j].piece == "王") && (board.square[i][j].direction != board.player.direction)
}

var choiceCapturedPiece = function(i, player) {
    if((board.player.direction == player.direction) && (board.capturedPiece[player.direction][i] != null)) {
      board.selectedPiece.i = i;
      board.selectedPiece.isCapturedPiece = true;

      board.movableZone = findCapturedPieceMovableZone();
      var square = findSquareDom(board.movableZone);

      board.drawMovableZone(square);
      board.isChoiceMode = true;
    }
}

var choicePiece = function(i,j) {
  if((board.square[i][j].piece != null) && (board.square[i][j].direction == board.player.direction)) {
    board.selectedPiece.i = i;
    board.selectedPiece.j = j;
    board.selectedPiece.isCapturedPiece = false;
    board.selectedPiece.domObj = $("#square" + i + j);

    board.movableZone = board.getMovableZone(i, j);
    var square = findSquareDom(board.movableZone);
    board.drawMovableZone(square);
    board.isChoiceMode = true;
  }
}

var isMovable = function(i,j) {
  var movable = false;
  board.movableZone.forEach(function(zone) {
    if((j == zone[0]) && (i == zone[1])) {
      movable = true;
    }
  })
  return movable;
}

var moveCapturedPiece = function(i, j) {
  //マスの情報を変更する
  board.square[i][j] = {
    "piece"     : board.capturedPiece[board.player.direction][board.selectedPiece.i],
    "direction" : board.player.direction
  };
  //もち駒を削除
  board.capturedPiece[board.player.direction].splice(board.selectedPiece.i, 1);
  board.drawCapturedPiece(board.player.direction);

  //駒の画像を変更する
  var pieceImgSrc = "/assets/images/piece/" + getPieceImage(board.square[i][j]);
  $("#square" + i + j).html("<img width='47px' height='54px' src='" + pieceImgSrc + "' />");
}

var robPieceIfNeed = function(i, j) {
  if(board.square[i][j].piece != null) {
    board.capturedPiece[board.player.direction].push(getPieceHead(board.square[i][j].piece));
    board.drawCapturedPiece(board.player.direction);
  }
}

var drawClearMovableSquare = function() {
  for(var count = 0; count < board.movableSquareDomObj.length; count++ ){
    board.movableSquareDomObj[count].css("background-color","orange");
  }
  board.movableSquareDomObj.length = 0;
}

var turnEnd = function() {
  //相手のターンに移る
  if(board.player == board.playerType.black) {
    board.player = board.playerType.white;
  } else {
    board.player = board.playerType.black;
  }
  $("#playerInfo").html(board.player.name + "の番です．");
}

//駒の移動処理
var movePiece = function(i, j) {
  //マスの情報を変更する
  board.square[i][j] = {
      "piece"    :board.square[board.selectedPiece.i][board.selectedPiece.j].piece,
      "direction"  :board.player.direction
  };

  board.square[board.selectedPiece.i][board.selectedPiece.j] = {
      "piece"     : null,
      "direction" : null
  };

  //成金処理
  narikin({
    "src_i" : board.selectedPiece.i,
    "src_j" : board.selectedPiece.j,
    "dst_i" : i,
    "dst_j" : j,
    "player" : board.player,
    "piece" : board.square[i][j].piece
  });

  //マスの画像を変更する
  var pieceImgSrc = "/assets/images/piece/" + getPieceImage(board.square[i][j]);
  $("#square" + board.selectedPiece.i + board.selectedPiece.j).html("");
  $("#square" + i + j).html("<img width='47px' height='54px' src='" + pieceImgSrc + "' />");
};

//成金処理
// TODO: と金に成のは強制じゃないらしい。ユーザーに選ばせる必要あり。
var narikin = function(data) {
  if(data.player == board.playerType.black){
    if((data.dst_j >= 0 && data.dst_j < 3) || (data.src_j >= 0 && data.src_j < 3)) {
      setNarikin(data.dst_i, data.dst_j, data.piece);
    }

  } else {
    if((data.dst_j > 5 && data.dst_j < 9) || (data.src_j > 5 && data.src_j < 9)) {
      setNarikin(data.dst_i, data.dst_j, data.piece);
    }
  }
};

//駒の描写処理
board.draw = function () {
  // マス配列の走査
  for(var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      // マスにある駒の、画像に変更する
      var squareId = "#square" + i + j;

      // マスに駒がある場合
      if(board.square[i][j].piece != null) {
        var pieceImgSrc = "/assets/images/piece/" + getPieceImage(board.square[i][j]);
        $(squareId).html("<img class='piece_image' width='47px' height='54px' src='" + pieceImgSrc + "' />");

      } else {
        $(squareId).html("");
      }
    }
  }
};

//もち駒の描画処理
board.drawCapturedPiece = function(player) {
  for(var count = 0; count <= 19; count++) {
    $("#capturedPiece" + player + count).html("");
  }

  for(var count = 0; count < board.capturedPiece[player].length; count++ ){
    //駒情報の格納
    var piece = board.capturedPiece[player][count];
    var pieceImgSrc = "/assets/images/piece/" + getPieceImage({"piece":piece, "direction":player});
    var capturedPieceSquare = $("#capturedPiece" + player + count);

    capturedPieceSquare.html("<img width='42px' height='49px' src='" + pieceImgSrc + "' />");
  }
};

//移動可能範囲に色を塗る
board.drawMovableZone = function(doms){
  doms.forEach(function(dom){
    dom.css("background-color","#ff7373");
  })

  board.movableSquareDomObj = doms;
};

board.checkmate = function(battleResult) {
  if(battleResult == "win") {
    html = board.player.name + "の勝ち！";

  } else {
    html = board.player.name + "の負け…。";
  }

  var winner_id = 0
  $.post("/histories",{
    'winner': board.player.id,
    'timestamp': Math.floor(new Date().getTime())
  });

  //ダイアログの表示
  $("body").append("<div id='endDialog'>"+ html +"</div>");
  $("#endDialog").dialog({
    show: "slide",
    title: "試合終了",
    modal: true,
    minWidth: 400,
    autoOpen:true,
    open:function(event, ui){$(".ui-dialog-titlebar-close").hide();},
    buttons: {
    "終了": function(event) {
      $(this).dialog("close");
    }
    },
    close: function(event) {
    board.isNoCheckUnload = true;
      location.reload();
    }
  });

};

/**
 * 駒を移動できる範囲の算出
 */
var findCapturedPieceMovableZone = function() {
  var zone = new Array();
  for(var x = 0; x < 9; x++) {
    for(var y = 0; y < 9; y++) {
      if(board.square[x][y].piece == null) {
        zone.push([y,x]);
      }
    }
  }
  return zone;
}

/**
 * マスの座標からコマのDOMを取得
 */
var findSquareDom = function(zones) {
  var doms = new Array;
  zones.forEach(function(zone) {
    doms.push($("#square" + zone[1] + zone[0]));
  })
  return doms;
}

//駒裏返し処理
var setNarikin = function (i, j, piece) {
  switch(piece)  {
    case '飛':
      board.square[i][j].piece = '竜';
      break;
    case '角':
      board.square[i][j].piece = '馬';
      break;
    case '歩':
      board.square[i][j].piece = 'と';
      break;
    case '銀':
      board.square[i][j].piece = "成銀";
      break;
    case '桂':
      board.square[i][j].piece = '圭';
      break;
    case '香':
      board.square[i][j].piece = '杏';
      break;
    default:
  }
};

//駒の表を取得する
var getPieceHead = function (piece) {
  switch(piece)  {
    case '竜':
      return "飛";
    case '馬':
      return "角";
    case 'と':
      return "歩";
    case '成銀':
      return "銀";
    case '圭':
      return "桂";
    case '杏':
      return '香';
    default:
      return piece;
  }
};

// 駒の画像を返すメソッド
var getPieceImage = function(square) {
  if(square.direction === null) {
    alert(square.piece);
    return board.pieceImg[square.piece][0];
  }

  if(square.direction == "North") {
    return board.pieceImg[square.piece][0];

  } else if (square.direction == "South") {
    return board.pieceImg[square.piece][1];

  } else {
    return board.pieceImg[square][0];

  }
};

var playSound = function() {
  $('#sound-file').get(0).play();
}
