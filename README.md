# syougi-web

[demo](http://takuan.me:9000/)

![screen_shot_top.png](screen_shot_top.png)

![screen_shot_battle.png](screen_shot_battle.png)

![screen_shot_history.png](screen_shot_history.png)

## project structure

layered architecture

```
─── app
    ├── controllers
    ├── domains
    │   ├── lifecycle
    │   ├── models
    │   └── support
    ├── infrastructures
    └── views
```

## how to launch

```bash
$ git clone git@github.com:oshiro-kazuma/syougi-web.git
$ cd syougi-web
$ sbt run
$ open http://localhost:9000
```

## about this

  将棋対戦ゲームです。一つの画面で、先手・後手交互に駒を進めて遊んでください。
  
  対戦結果は保存され「戦績」画面で確認できます。（永続化していないため再起動すると消えてしまいます！）

## link
[frontend only syougi.js](https://github.com/oshiro-kazuma/syougi.js)
