
//TODO 二歩チェックが未実装

//名前空間の定義
var board = {};

var findCapturedPieceMovableZone = function() {
  var zone = new Array();
  //駒を移動できる範囲の算出
  for(var x = 0; x < 9; x++) {
    for(var y = 0; y < 9; y++) {
      if(board.masu[x][y].piece == null) {
        zone.push([y,x]);
      }
    }
  }
  return zone;
}

var pickMasuDom = function(zone) {
  var doms = new Array;
  for(var count = 0; count < zone.length; count++ ) {
    var x = zone[count][0];
    var y = zone[count][1];
    doms.push($("#masu" + y + x));
  }
  return doms;
}

board.onClickCapturedPiece = function(i, player) {

  //もち駒選択
  if (board.isSelectMode == false) {
    if((board.player == player) && (board.capturedPiece[player][i] != null)) {
      board.selectedPiece.i = i;
      board.selectedPiece.j = player;

      board.movableZone = findCapturedPieceMovableZone();
      var masu = pickMasuDom(board.movableZone);

      //移動できる範囲に色を塗る
      board.drawMovableZone(masu);
      board.isSelectMode = true;
    }
  //もう一度クリックしたとき
  } else {
    board.isSelectMode = false;

    //移動可能範囲の背景色を戻す
    for(var count = 0; count < board.movableMasuDomObj.length; count++ ){
      board.movableMasuDomObj[count].css("background-color","orange");
    }
    //配列削除処理
    board.movableMasuDomObj.length = 0;
  }
};

//マスがクリックされた時の処理
board.onClickMasu = function(i,j) {

  // 移動する駒を選択する処理
  if (board.isSelectMode == false) {
    if((board.masu[i][j].piece != null) && (board.masu[i][j].direction == board.player)) {
      board.selectedPiece.i = i;
      board.selectedPiece.j = j;
      board.selectedPiece.domObj = $("#masu" + i + j);

      //駒を移動できる範囲の算出
      board.movableZone = board.getMovableZone(i, j);
      var masu = pickMasuDom(board.movableZone);

      //移動できる範囲に色を塗る
      board.drawMovableZone(masu);
      board.isSelectMode = true;
    }
  //選択した駒を、移動する処理
  } else {
    //非選択状態にする
    board.isSelectMode = false;

    //移動可能範囲の背景色を戻す
    for(var count = 0; count < board.movableMasuDomObj.length; count++ ){
      board.movableMasuDomObj[count].css("background-color","orange");
    }

    //配列削除処理
    board.movableMasuDomObj.length = 0;

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
        board.masu[i][j] = {
            "piece"    :board.capturedPiece[board.selectedPiece.j][board.selectedPiece.i],
            "direction"  :board.player
        };
        //もち駒を削除
        board.capturedPiece[board.selectedPiece.j].splice(board.selectedPiece.i, 1);
        board.drawCapturedPiece(board.player);

        //駒の画像を変更する
        var pieceImgSrc = "/assets/images/piece/" + board.getPieceImage(board.masu[i][j]);
        $("#masu" + i + j).html("<img width='47px' height='54px' src='" + pieceImgSrc + "' />");


      //通常時
      } else {
        //勝利判定
        if((board.masu[i][j].piece == "王") && (board.masu[i][j].direction != board.player)) {
          board.checkmate("win");
        }

        //相手の駒を取った場合、もち駒に加える
        if(board.masu[i][j].piece != null) {

          //もち駒の描画処理
          board.capturedPiece[board.player].push(board.getPieceHead(board.masu[i][j].piece));
          board.drawCapturedPiece(board.player);
        }
        //駒移動処理
        board.movePiece(i, j);

      }

      //相手のターンに移る
      if(board.player == "North") {
        board.player = "South";
        $("#playerInfo").html("南の番です．");

      } else {
        board.player = "North";
        $("#playerInfo").html("北の番です．");
      }
    }
  }

};
//駒の移動処理
board.movePiece = function(i, j) {

  //マスの情報を変更する
  board.masu[i][j] = {
      "piece"    :board.masu[board.selectedPiece.i][board.selectedPiece.j].piece,
      "direction"  :board.player
  };

  board.masu[board.selectedPiece.i][board.selectedPiece.j] = {
      "piece"     : null,
      "direction" : null
  };

  //成金処理
  board.narikin({
    "src_i" : board.selectedPiece.i,
    "src_j" : board.selectedPiece.j,
    "dst_i" : i,
    "dst_j" : j,
    "player" : board.player,
    "piece" : board.masu[i][j].piece
  });

  //マスの画像を変更する
  var pieceImgSrc = "/assets/images/piece/" + board.getPieceImage(board.masu[i][j]);
  $("#masu" + board.selectedPiece.i + board.selectedPiece.j).html("");
  $("#masu" + i + j).html("<img width='47px' height='54px' src='" + pieceImgSrc + "' />");

};

//成金処理
// TODO: と金に成のは強制じゃないらしい。ユーザーに選ばせる必要あり。
board.narikin = function(data) {

  if(data.player == "North"){
    if((data.dst_j >= 0 && data.dst_j < 3) || (data.src_j >= 0 && data.src_j < 3)) {
      board.setNarikin(data.dst_i, data.dst_j, data.piece);
    }

  } else {
    if((data.dst_j > 5 && data.dst_j < 9) || (data.src_j > 5 && data.src_j < 9)) {
      board.setNarikin(data.dst_i, data.dst_j, data.piece);
    }
  }

};

//駒裏返し処理
board.setNarikin = function (i, j, piece) {
  switch(piece)  {
    case '飛':
      board.masu[i][j].piece = '竜';
      break;
    case '角':
      board.masu[i][j].piece = '馬';
      break;
    case '歩':
      board.masu[i][j].piece = 'と';
      break;
    case '銀':
      board.masu[i][j].piece = "成銀";
      break;
    case '桂':
      board.masu[i][j].piece = '圭';
      break;
    case '香':
      board.masu[i][j].piece = '杏';
      break;
    default:
  }
};

//駒の表を取得する
board.getPieceHead = function (piece) {

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

//駒の描写処理
board.draw = function () {
  // マス配列の走査
  for(var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      // マスにある駒の、画像に変更する
      var masuId = "#masu" + i + j;

      // マスに駒がある場合
      if(board.masu[i][j].piece != null) {
        var pieceImgSrc = "/assets/images/piece/" + board.getPieceImage(board.masu[i][j]);
        $(masuId).html("<img class='piece_image' width='47px' height='54px' src='" + pieceImgSrc + "' />");

      } else {
        $(masuId).html("");
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
    var pieceImgSrc = "/assets/images/piece/" + board.getPieceImage({"piece":piece, "direction":player});
    var capturedPieceMasu = $("#capturedPiece" + player + count);

    capturedPieceMasu.html("<img width='42px' height='49px' src='" + pieceImgSrc + "' />");
  }
};

// 駒の画像を返すメソッド
board.getPieceImage = function(masu) {
  if(masu.direction === null) {
    alert(masu.piece);
    return board.pieceImg[masu.piece][0];
  }

  if(masu.direction == "North") {
    return board.pieceImg[masu.piece][0];

  } else if (masu.direction == "South") {
    return board.pieceImg[masu.piece][1];

  } else {
    return board.pieceImg[masu][0];

  }
};

//移動可能範囲に色を塗る
board.drawMovableZone = function(doms){
  doms.forEach(function(v,i){
    v.css("background-color","#ff7373");
  })

  board.movableMasuDomObj = doms;
};

board.checkmate = function(battleResult) {
  if(battleResult == "win") {
    html = board.player + " player win!!";

  } else {
    html = board.player + " player lose...";
  }

//
  var winner_id = 0
  if(board.player == "North") {
    winner_id = 1
  } else {
    winner_id = 2
  }
  $.post("/histories",{
    'winner': winner_id,
    'time': "2015-01-01 11:22"
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
