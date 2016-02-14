//移動可能範囲を算出する
ban.getMovableZone = function (i, j){

  var piece = ban.masu[i][j].piece;

  //香の場合
  if (piece == "香") {
    return ban.getMovableZone2(i,j,piece);

  //飛車・角の場合
  } else if ((piece == "飛") || (piece == "角")) {
    return ban.getMovableZone3(i,j,piece);

  //竜・馬の場合
  } else if ((piece == "竜") || (piece == "馬")) {
    return ban.getMovableZone4(i,j,piece);

  //飛車、角、香以外の駒の場合
  } else {
    return ban.getMovableZone1(i,j,piece);
  }

};

//飛車、角、香以外の駒の場合
ban.getMovableZone1 = function(i, j, piece){

  //移動可能ゾーンを格納する
  var returnZone = new Array();

  $("#debug").html(prettyPrint(ban.pieceMovableZone[piece]));

  for (var count = 0; count < ban.pieceMovableZone[piece].length; count++ ) {

    //移動可能ゾーンの取得
    var zone = ban.pieceMovableZone[piece][count];

    //データの確認
    $("#debug").html(prettyPrint(zone));

    //移動オフセット格納
    if(ban.masu[i][j].direction == "North"){
      var yOffset = i + ((-1) * zone[0]);
      var xOffset = j + ((-1) * zone[1]);
    } else {
      var yOffset = i + zone[0];
      var xOffset = j + zone[1];
    }

    if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

      //移動可能範囲内にあった場合
      if (ban.masu[yOffset][xOffset].direction != ban.player) {

        //移動可能ゾーンを格納
        returnZone.push([xOffset,yOffset]);
      }
    }
  }

  return returnZone;

};

//香の場合
ban.getMovableZone2 = function(i, j, piece){

  //移動可能ゾーンを格納する
  var returnZone = new Array();

  for (var count = 0; count < ban.pieceMovableZone[piece].length; count++ ) {

    //移動可能ゾーンの取得
    var zone = ban.pieceMovableZone[piece][count];

    //移動オフセット格納
    if(ban.masu[i][j].direction == "North"){
      var yOffset = i + ((-1) * zone[0]);
      var xOffset = j + ((-1) * zone[1]);
    } else {
      var yOffset = i + zone[0];
      var xOffset = j + zone[1];
    }

    if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

      //駒がない場合
      if (ban.masu[yOffset][xOffset].piece == null) {

        //移動可能ゾーンを格納
        returnZone.push([xOffset,yOffset]);

      //相手の駒の場合
      } else if (ban.masu[yOffset][xOffset].direction != ban.player) {

        //移動可能ゾーンを格納
        returnZone.push([xOffset,yOffset]);

        break;

      //それ以外
      } else if (ban.masu[yOffset][xOffset].direction == ban.player) {
        break;
      }

    }
  }

  return returnZone;

};

//飛車・角の場合
ban.getMovableZone3 = function(i, j, piece){

  //移動可能ゾーンを格納する
  var returnZone = new Array();

  $("#debug").html(prettyPrint(ban.pieceMovableZone[piece]));

  for (var count = 0; count < ban.pieceMovableZone[piece].length; count++ ) {

    //移動可能ゾーンの取得
    var zone = ban.pieceMovableZone[piece][count];

    //データの確認
    $("#debug").html(prettyPrint(zone));

    //移動オフセット格納
    if(ban.masu[i][j].direction == "North"){
      var yOffset = i + ((-1) * zone[0]);
      var xOffset = j + ((-1) * zone[1]);
    } else {
      var yOffset = i + zone[0];
      var xOffset = j + zone[1];
    }

    for(var count2 = 0; count2 < 9; count2++) {

      if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

        //駒がない場合
        if (ban.masu[yOffset][xOffset].piece == null) {

          //移動可能ゾーンを格納
          returnZone.push([xOffset,yOffset]);

        //相手の駒の場合
        } else if (ban.masu[yOffset][xOffset].direction != ban.player) {

          //移動可能ゾーンを格納
          returnZone.push([xOffset,yOffset]);

          break;

        //それ以外
        } else if (ban.masu[yOffset][xOffset].direction == ban.player) {
          break;
        }

        //移動オフセット格納
        if(ban.masu[i][j].direction == "North"){
          var yOffset = yOffset + ((-1) * zone[0]);
          var xOffset = xOffset + ((-1) * zone[1]);
        } else {
          var yOffset = yOffset + zone[0];
          var xOffset = xOffset + zone[1];
        }

      }
    }
  }

  return returnZone;

};

//竜・馬の場合
ban.getMovableZone4 = function(i, j, piece){

  //移動可能ゾーンを格納する
  var returnZone = new Array();

  for (var count = 0; count < 4; count++ ) {

    //移動可能ゾーンの取得
    var zone = ban.pieceMovableZone[piece][count];

    //移動オフセット格納
    if(ban.masu[i][j].direction == "North"){
      var yOffset = i + ((-1) * zone[0]);
      var xOffset = j + ((-1) * zone[1]);
    } else {
      var yOffset = i + zone[0];
      var xOffset = j + zone[1];
    }

    for(var count2 = 0; count2 < 9; count2++) {

      if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

        //駒がない場合
        if (ban.masu[yOffset][xOffset].piece == null) {

          //移動可能ゾーンを格納
          returnZone.push([xOffset,yOffset]);

        //相手の駒の場合
        } else if (ban.masu[yOffset][xOffset].direction != ban.player) {

          //移動可能ゾーンを格納
          returnZone.push([xOffset,yOffset]);

          break;

        //それ以外
        } else if (ban.masu[yOffset][xOffset].direction == ban.player) {
          break;
        }

        //移動オフセット格納
        if(ban.masu[i][j].direction == "North"){
          var yOffset = yOffset + ((-1) * zone[0]);
          var xOffset = xOffset + ((-1) * zone[1]);
        } else {
          var yOffset = yOffset + zone[0];
          var xOffset = xOffset + zone[1];
        }

      }
    }
  }

  //1マス移動分の範囲
  for(var count = 4; count < 8; count++) {

    //移動可能ゾーンの取得
    var zone = ban.pieceMovableZone[piece][count];

    //オフセット設定
    var Xoffset = 0;
    var Yoffset = 0;

    //移動オフセット格納
    if(ban.masu[i][j].direction == "North"){
      var yOffset = i + ((-1) * zone[0]);
      var xOffset = j + ((-1) * zone[1]);
    } else {
      var yOffset = i + zone[0];
      var xOffset = j + zone[1];
    }

    if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {
      if (ban.masu[yOffset][xOffset].direction != ban.player) {

        //移動可能ゾーンを格納
        returnZone.push([xOffset,yOffset]);
      }
    }

  }

  return returnZone;

};
