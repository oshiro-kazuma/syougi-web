
//TODO 二歩チェックが未実装

//名前空間の定義
var board = {};

board.onClickCapturedPiece = function(i, player) {
  //もち駒選択
  if (board.isSelectMode == false) {
    if((board.player.direction == player.direction) && (board.capturedPiece[player.direction][i] != null)) {
      board.selectedPiece.i = i;
      board.selectedPiece.j = player.direction;

      board.movableZone = findCapturedPieceMovableZone();
      var square = findSquareDom(board.movableZone);

      //移動できる範囲に色を塗る
      board.drawMovableZone(square);
      board.isSelectMode = true;
    }
  //もう一度クリックしたとき
  } else {
    board.isSelectMode = false;

    //移動可能範囲の背景色を戻す
    for(var count = 0; count < board.movableSquareDomObj.length; count++ ){
      board.movableSquareDomObj[count].css("background-color","orange");
    }
    //配列削除処理
    board.movableSquareDomObj.length = 0;
  }
};

//マスがクリックされた時の処理
board.onClickSquare = function(i,j) {
  // 移動する駒を選択する処理
  if (board.isSelectMode == false) {
    if((board.square[i][j].piece != null) && (board.square[i][j].direction == board.player.direction)) {
      board.selectedPiece.i = i;
      board.selectedPiece.j = j;
      board.selectedPiece.domObj = $("#square" + i + j);

      //駒を移動できる範囲の算出
      board.movableZone = board.getMovableZone(i, j);
      var square = findSquareDom(board.movableZone);

      //移動できる範囲に色を塗る
      board.drawMovableZone(square);
      board.isSelectMode = true;
    }
  //選択した駒を、移動する処理
  } else {
    //非選択状態にする
    board.isSelectMode = false;

    //移動可能範囲の背景色を戻す
    for(var count = 0; count < board.movableSquareDomObj.length; count++ ){
      board.movableSquareDomObj[count].css("background-color","orange");
    }

    //配列削除処理
    board.movableSquareDomObj.length = 0;

    //移動可能であるかの判定
    var isMovable = false;
    for(var count = 0; count < board.movableZone.length; count++ ){
      if((j == board.movableZone[count][0]) && (i == board.movableZone[count][1])) {
        isMovable = true;
        break;
      }
    }

    if(isMovable == true) {
      $('#sound-file').get(0).play();

      //もち駒の場合
      if(board.selectedPiece.j == "South" || board.selectedPiece.j == "North") {

        //マスの情報を変更する
        board.square[i][j] = {
            "piece"    :board.capturedPiece[board.selectedPiece.j][board.selectedPiece.i],
            "direction"  :board.player.direction
        };
        //もち駒を削除
        board.capturedPiece[board.selectedPiece.j].splice(board.selectedPiece.i, 1);
        board.drawCapturedPiece(board.player.direction);

        //駒の画像を変更する
        var pieceImgSrc = "/assets/images/piece/" + getPieceImage(board.square[i][j]);
        $("#square" + i + j).html("<img width='47px' height='54px' src='" + pieceImgSrc + "' />");


      //通常時
      } else {
        //勝利判定
        if((board.square[i][j].piece == "王") && (board.square[i][j].direction != board.player.direction)) {
          board.checkmate("win");
        }

        //相手の駒を取った場合、もち駒に加える
        if(board.square[i][j].piece != null) {
          //もち駒の描画処理
          board.capturedPiece[board.player.direction].push(getPieceHead(board.square[i][j].piece));
          board.drawCapturedPiece(board.player.direction);
        }
        //駒移動処理
        movePiece(i, j);
      }

      //相手のターンに移る
      if(board.player == board.playerType.black) {
        board.player = board.playerType.white;
      } else {
        board.player = board.playerType.black;
      }
      $("#playerInfo").html(board.player.name + "の番です．");
    }
  }
};
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
  doms.forEach(function(v,i){
    v.css("background-color","#ff7373");
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
 * 駒を移動できるマスの取得
 */
var findSquareDom = function(zone) {
  var doms = new Array;
  for(var count = 0; count < zone.length; count++ ) {
    var x = zone[count][0];
    var y = zone[count][1];
    doms.push($("#square" + y + x));
  }
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
