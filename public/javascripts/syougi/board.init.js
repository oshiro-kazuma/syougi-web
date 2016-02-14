/**
 * 初期化処理
 */

board.init = function() {
  init_play_data();
  init_board();
  init_board_moti_piece_all();
  init_piece();
}

var init_play_data = function() {
  //プレイヤー
  board.player = "North";
  board.partnerPlayer = "South";
  board.nextPlayer = "North";
  board.isSelectMode = false;    //駒を選択中かどうか
  board.isMoveDataRemoving = true;  //ページを離れるときに、駒移動情報を削除するかどうか
  board.isNoCheckUnload == false;  //ページを離れるときに、確認しないかどうか
  board.isChecingAway = false;    //対戦相手の離席をチェックする状態
  board.pollingInterval = 2000;    //ポーリングのインターバル設定

  //選択中の駒情報
  board.selectedPiece = {
    "domObj" : null,
    "i" : null,
    "j" : null
  };
  //駒の移動範囲を格納
  board.movableZone;
  board.movableMasuDomObj = new Array();
  //もち駒格納変数
  board.capturedPiece = {"South" : new Array(), "North" : new Array() };
}

//盤、マスの初期化
var init_board = function() {
  //マス配列の初期化処理
  board.masu = new Array(9);
  for ( var i = 0 ; i < 9 ; i++ ){
    board.masu[i] = new Array(9);
    for (var j = 0; j < 9; j++) {
      board.masu[i][j] = {"piece" : null, "direction" : null};
    }
  }

  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 9; j++) {
      add_masu_dom(i, j);
    }
  }
};

var add_masu_dom = function(i, j) {
  // 盤にマスを追加
  var html = "<div class='masu' id='masu"+j+i+"'></div>";
  $("#board").append(html);

  // マスのDOMを取得
  var masu = $("#masu" + j + i);

  // マウスがのっかった時のイベントの登録
  masu.hover(
    function () {
      $(this).animate({
        opacity: 0.8
      }, "fast" );
    },
    function () {
      $(this).animate({
        opacity: 1
      }, "fast" );
    }
  );

  // クリック時のイベント登録
  masu.click( function(i,j) {
    var _i = i;
    var _j = j;

    return function(e) {
      board.onClickMasu(_i,_j);
    };
  } (j,i));
};

//もち駒盤の初期化処理
var init_board_moti_piece_all = function() {
  init_board_moti_piece("North");
  init_board_moti_piece("South");
};

var init_board_moti_piece = function(player) {
  for(var i = 0; i < 20; i++) {
    // マスの追加
    var html = "<div class='capturedPiece' id='capturedPiece" + player + i +"'></div>";
    $("#capturedPiece" + player).append(html);

    var piece = $("#capturedPiece"+ player + i);

    // マウスがのっかった時のイベントの登録
    piece.hover(
      function () {
        $(this).animate({
            opacity: 0.8
          }, "fast" );
      },
      function () {
        $(this).animate({
          opacity: 1
        }, "fast" );
      }
    );

    // クリック時のイベント登録
    piece.click( function(i) {
      var _i = i;

      return function(e) {
        board.onClickCapturedPiece(_i, player);
      };
    } (i));
  }
}

// 駒の初期化配置
var init_piece = function () {
  //North向きの駒の設定
  board.masu[0][8] = {"piece":"香", "direction":"North"};
  board.masu[1][8] = {"piece":"桂", "direction":"North"};
  board.masu[2][8] = {"piece":"銀", "direction":"North"};
  board.masu[3][8] = {"piece":"金", "direction":"North"};
  board.masu[4][8] = {"piece":"王", "direction":"North"};
  board.masu[5][8] = {"piece":"金", "direction":"North"};
  board.masu[6][8] = {"piece":"銀", "direction":"North"};
  board.masu[7][8] = {"piece":"桂", "direction":"North"};
  board.masu[8][8] = {"piece":"香", "direction":"North"};
  board.masu[1][7] = {"piece":"角", "direction":"North"};
  board.masu[7][7] = {"piece":"飛", "direction":"North"};
  board.masu[0][6] = {"piece":"歩", "direction":"North"};
  board.masu[1][6] = {"piece":"歩", "direction":"North"};
  board.masu[2][6] = {"piece":"歩", "direction":"North"};
  board.masu[3][6] = {"piece":"歩", "direction":"North"};
  board.masu[4][6] = {"piece":"歩", "direction":"North"};
  board.masu[5][6] = {"piece":"歩", "direction":"North"};
  board.masu[6][6] = {"piece":"歩", "direction":"North"};
  board.masu[7][6] = {"piece":"歩", "direction":"North"};
  board.masu[8][6] = {"piece":"歩", "direction":"North"};

  //South向きの駒の設定
  board.masu[0][0] = {"piece":"香", "direction":"South"};
  board.masu[1][0] = {"piece":"桂", "direction":"South"};
  board.masu[2][0] = {"piece":"銀", "direction":"South"};
  board.masu[3][0] = {"piece":"金", "direction":"South"};
  board.masu[4][0] = {"piece":"王", "direction":"South"};
  board.masu[5][0] = {"piece":"金", "direction":"South"};
  board.masu[6][0] = {"piece":"銀", "direction":"South"};
  board.masu[7][0] = {"piece":"桂", "direction":"South"};
  board.masu[8][0] = {"piece":"香", "direction":"South"};
  board.masu[1][1] = {"piece":"飛", "direction":"South"};
  board.masu[7][1] = {"piece":"角", "direction":"South"};
  board.masu[0][2] = {"piece":"歩", "direction":"South"};
  board.masu[1][2] = {"piece":"歩", "direction":"South"};
  board.masu[2][2] = {"piece":"歩", "direction":"South"};
  board.masu[3][2] = {"piece":"歩", "direction":"South"};
  board.masu[4][2] = {"piece":"歩", "direction":"South"};
  board.masu[5][2] = {"piece":"歩", "direction":"South"};
  board.masu[6][2] = {"piece":"歩", "direction":"South"};
  board.masu[7][2] = {"piece":"歩", "direction":"South"};
  board.masu[8][2] = {"piece":"歩", "direction":"South"};
};
