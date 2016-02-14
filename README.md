# syougi-web

[demo](http://takuan.me:9000/)

![screen_shot_top.png](screen_shot_top.png)

![screen_shot_battle.png](screen_shot_battle.png)

![screen_shot_history.png](screen_shot_history.png)

## project structure

layered architecture

```
├── app
│   ├── controllers (web controllers)
│   ├── domains
│   │   ├── lifecycle (ライフサイクル、モデルの永続化処理)
│   │   ├── models (ドメインモデル)
│   │   └── support
│   ├── infrastructures（今回はスキップ、メモリに永続化）
│   └── views (view template)
└── public
    ├── fonts
    ├── images
    ├── javascripts
    │   └── syougi
    │       ├── board.js (メイン)
    │       ├── board.init.js (初期化処理)
    │       ├── board.pieces.js (駒の移動処理)
    │       └── board.setting.js (駒の移動範囲設定等)
    ├── sounds
    │   └── piece.wav (駒を移動した時の効果音)
    └── stylesheets
        └── syougi
```

Reader Monad を使ってRepositoryの実装を切り替えられるようにしています。

## how to launch

```bash
$ git clone git@github.com:oshiro-kazuma/syougi-web.git
$ cd syougi-web
$ sbt run
$ open http://localhost:9000
```

## about this

  将棋対戦ゲームです。一つの画面で、先手・後手交互に駒を進めて遊んでください。
  
  対戦結果は保存され「戦績」画面で確認できます。（ストレージに永続化していない為、アプリを再起動すると消えてしまいます！）

## link
[frontend only syougi.js](https://github.com/oshiro-kazuma/syougi.js)
