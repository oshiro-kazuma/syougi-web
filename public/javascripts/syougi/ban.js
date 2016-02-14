
//TODO 二歩チェックが未実装

//名前空間の定義
var ban = {};

var findCapturedPieceMovableZone = function() {
  var zone = new Array();
  //駒を移動できる範囲の算出
  for(var x = 0; x < 9; x++) {
    for(var y = 0; y < 9; y++) {
      if(ban.masu[x][y].piece == null) {
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

ban.onClickCapturedPiece = function(i, player) {

  //もち駒選択
  if (ban.isSelectMode == false) {
    if((ban.player == player) && (ban.capturedPiece[player][i] != null)) {
      ban.selectedPiece.i = i;
      ban.selectedPiece.j = player;

      ban.movableZone = findCapturedPieceMovableZone();
      var masu = pickMasuDom(ban.movableZone);

      //移動できる範囲に色を塗る
      ban.drawMovableZone(masu);
      ban.isSelectMode = true;
    }
  //もう一度クリックしたとき
  } else {
    ban.isSelectMode = false;

    //移動可能範囲の背景色を戻す
    for(var count = 0; count < ban.movableMasuDomObj.length; count++ ){
      ban.movableMasuDomObj[count].css("background-color","orange");
    }
    //配列削除処理
    ban.movableMasuDomObj.length = 0;
  }
};

//マスがクリックされた時の処理
ban.onClickMasu = function(i,j) {

  // 移動する駒を選択する処理
  if (ban.isSelectMode == false) {
    console.log("debug!!! false");
    if((ban.masu[i][j].piece != null) && (ban.masu[i][j].direction == ban.player)) {
      ban.selectedPiece.i = i;
      ban.selectedPiece.j = j;
      ban.selectedPiece.domObj = $("#masu" + i + j);

      //駒を移動できる範囲の算出
      ban.movableZone = ban.getMovableZone(i, j);
      var masu = pickMasuDom(ban.movableZone);

      //移動できる範囲に色を塗る
      ban.drawMovableZone(masu);
      ban.isSelectMode = true;
    }
  //選択した駒を、移動する処理
  } else {
    console.log("debug!!! true");
    //非選択状態にする
    ban.isSelectMode = false;

    //移動可能範囲の背景色を戻す
    for(var count = 0; count < ban.movableMasuDomObj.length; count++ ){
      ban.movableMasuDomObj[count].css("background-color","orange");
    }

    //配列削除処理
    ban.movableMasuDomObj.length = 0;

    //移動可能であるかの判定
    var isMovable = false;
    console.log("debug mobable zone", ban.movableZone);
    for(var count = 0; count < ban.movableZone.length; count++ ){
      if((j == ban.movableZone[count][0]) && (i == ban.movableZone[count][1])) {
        isMovable = true;
        console.log("mobable ?", isMovable);
        break;
      }
    }

    if(isMovable == true) {
      $('#sound-file').get(0).play();

      //もち駒の場合
      if(ban.selectedPiece.j == "South" || ban.selectedPiece.j == "North") {

        //マスの情報を変更する
        ban.masu[i][j] = {
            "piece"    :ban.capturedPiece[ban.selectedPiece.j][ban.selectedPiece.i],
            "direction"  :ban.player
        };
        //もち駒を削除
        ban.capturedPiece[ban.selectedPiece.j].splice(ban.selectedPiece.i, 1);
        ban.drawCapturedPiece(ban.player);

        //駒の画像を変更する
        var pieceImgSrc = "/assets/images/piece/" + ban.getPieceImage(ban.masu[i][j]);
        $("#masu" + i + j).html("<img width='47px' height='54px' src='" + pieceImgSrc + "' />");


      //通常時
      } else {
        //勝利判定
        if((ban.masu[i][j].piece == "王") && (ban.masu[i][j].direction != ban.player)) {
          ban.checkmate("win");
        }

        //相手の駒を取った場合、もち駒に加える
        if(ban.masu[i][j].piece != null) {

          //もち駒の描画処理
          ban.capturedPiece[ban.player].push(ban.getPieceHead(ban.masu[i][j].piece));
          ban.drawCapturedPiece(ban.player);
        }
        //駒移動処理
        ban.movePiece(i, j);

      }

      //相手のターンに移る
      if(ban.player == "North") {
        ban.player = "South";
        $("#playerInfo").html("南の番です．");

      } else {
        ban.player = "North";
        $("#playerInfo").html("北の番です．");
      }
    }
  }

};
//駒の移動処理
ban.movePiece = function(i, j) {

  //マスの情報を変更する
  ban.masu[i][j] = {
      "piece"    :ban.masu[ban.selectedPiece.i][ban.selectedPiece.j].piece,
      "direction"  :ban.player
  };

  ban.masu[ban.selectedPiece.i][ban.selectedPiece.j] = {
      "piece"     : null,
      "direction" : null
  };

  //成金処理
  ban.narikin({
    "src_i" : ban.selectedPiece.i,
    "src_j" : ban.selectedPiece.j,
    "dst_i" : i,
    "dst_j" : j,
    "player" : ban.player,
    "piece" : ban.masu[i][j].piece
  });

  //マスの画像を変更する
  var pieceImgSrc = "/assets/images/piece/" + ban.getPieceImage(ban.masu[i][j]);
  $("#masu" + ban.selectedPiece.i + ban.selectedPiece.j).html("");
  $("#masu" + i + j).html("<img width='47px' height='54px' src='" + pieceImgSrc + "' />");

};

//成金処理
// TODO: と金に成のは強制じゃないらしい。ユーザーに選ばせる必要あり。
ban.narikin = function(data) {

  if(data.player == "North"){
    if((data.dst_j >= 0 && data.dst_j < 3) || (data.src_j >= 0 && data.src_j < 3)) {
      ban.setNarikin(data.dst_i, data.dst_j, data.piece);
    }

  } else {
    if((data.dst_j > 5 && data.dst_j < 9) || (data.src_j > 5 && data.src_j < 9)) {
      ban.setNarikin(data.dst_i, data.dst_j, data.piece);
    }
  }

};

//駒裏返し処理
ban.setNarikin = function (i, j, piece) {
  switch(piece)  {
    case '飛':
      ban.masu[i][j].piece = '竜';
      break;
    case '角':
      ban.masu[i][j].piece = '馬';
      break;
    case '歩':
      ban.masu[i][j].piece = 'と';
      break;
    case '銀':
      ban.masu[i][j].piece = "成銀";
      break;
    case '桂':
      ban.masu[i][j].piece = '圭';
      break;
    case '香':
      ban.masu[i][j].piece = '杏';
      break;
    default:
  }
};

//駒の表を取得する
ban.getPieceHead = function (piece) {

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
ban.draw = function () {
  // マス配列の走査
  for(var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      // マスにある駒の、画像に変更する
      var masuId = "#masu" + i + j;

      // マスに駒がある場合
      if(ban.masu[i][j].piece != null) {
        var pieceImgSrc = "/assets/images/piece/" + ban.getPieceImage(ban.masu[i][j]);
        $(masuId).html("<img class='piece_image' width='47px' height='54px' src='" + pieceImgSrc + "' />");

      } else {
        $(masuId).html("");
      }
    }
  }
};

//もち駒の描画処理
ban.drawCapturedPiece = function(player) {
  for(var count = 0; count <= 19; count++) {
    $("#capturedPiece" + player + count).html("");
  }

  for(var count = 0; count < ban.capturedPiece[player].length; count++ ){

    //駒情報の格納
    var piece = ban.capturedPiece[player][count];
    var pieceImgSrc = "/assets/images/piece/" + ban.getPieceImage({"piece":piece, "direction":player});
    var capturedPieceMasu = $("#capturedPiece" + player + count);

    capturedPieceMasu.html("<img width='42px' height='49px' src='" + pieceImgSrc + "' />");
  }
};

// 駒の画像を返すメソッド
ban.getPieceImage = function(masu) {
  if(masu.direction === null) {
    alert(masu.piece);
    return ban.pieceImg[masu.piece][0];
  }

  if(masu.direction == "North") {
    return ban.pieceImg[masu.piece][0];

  } else if (masu.direction == "South") {
    return ban.pieceImg[masu.piece][1];

  } else {
    return ban.pieceImg[masu][0];

  }
};

//移動可能範囲に色を塗る
ban.drawMovableZone = function(doms){
  doms.forEach(function(v,i){
    v.css("background-color","#ff7373");
  })

  ban.movableMasuDomObj = doms;
};

ban.checkmate = function(battleResult) {
  if(battleResult == "win") {
    html = ban.player + " player win!!";

  } else {
    html = ban.player + " player lose...";
  }

//
  var winner_id = 0
  if(ban.player == "North") {
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
    ban.isNoCheckUnload = true;
      location.reload();
    }
  });

};
