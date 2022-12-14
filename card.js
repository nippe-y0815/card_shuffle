'use strict';

let ca;                                    //キャンバス
let caContext;                             //コンテキスト
let gScreen;                               //仮想キャンバス
let gScreenContext;                        //仮想キャンバスコンテキスト
let gFlame = 1;                            //内部カウンター
let gFlameMove = 0;                        //内部カウンター横移動
let gFlameMoveY = 0;                        //内部カウンター横移動
let gFlameMoveLY = 0;                        //内部カウンター横移動
let gFlameOpen = 0;                        //
let gFlameRadius = 1;                      //半径収縮カウンター
let gFlameRotate = 1;                      //右回り中カード回転カウンター
let cardCenterX;                           //カードrotateの中心座標
let cardCenterY;                           //カードrotateの中心座標
let cardAngle;                             //カード1枚1枚の回転アングル
let cardWidth = 720;                       //画像のカードの幅
let cardHeight = 1200;                      //画像のカードの高さ
let dCardWidth = cardWidth / 10;            //描画するカードの幅
let dCardHeight = cardHeight / 10;          //描画するカードの幅
let cardNum = 78;                          //カードの枚数
let degree = 0;                            //角度（度）
let WIDTH = 600;                           //仮想キャンバス幅
let HEIGHT = 600;                          //仮想キャンバス高さ
let theta;                                 //角度θ(カード一枚あたりの座標が描く扇の角度)
let timerIdX;                              //タイマーID
let timerIdM;                              //タイマーID
let x;                                     //カードのx座標
let moveX = 0;                             //カード座標の修正変数（スタート時にカードを移動するため）
let y;                                     //カードのy座標
let centerX = WIDTH / 2 - dCardWidth / 2;  //カード右回り中心のx座標
let centerY = HEIGHT / 2 - dCardHeight / 2;//カード右回り中心のy座標
let cardImage;                             //カード画像
let caBackImg;                             //キャンバス背景
let cover = document.querySelector(".cover");
let openCard = document.querySelector(".card-img");
let radius = WIDTH / 5;                    //回転の半径
let angle = [];                            //回転ランダム度数の配列
let angleLength;                           //回転ランダム度数の長さ
let angleMax;                              //回転ランダム度数の最大値
let startBtn = document.getElementById("start");//スタートボタン
let sCardNum = 15;                         //最初に表示するカードの枚数
let stopBtn = document.getElementById("stop");//ストップボタン
let openBtn = document.getElementById("open");//ストップボタン
const caColor = "rgb( 0, 127, 128)"          //背景色
const cardImageFile = "img/cardImg.png";      //カード画像パス
const caBackImgFile = "img/space.png";      //キャンバス背景画像URL

//画像読み込み
function loadImage() {
    cardImage = new Image();
    cardImage.src = cardImageFile;
    caBackImg = new Image();
    caBackImg.src = caBackImgFile;
}

// ランダム数値配列の生成
function getRandomInt(Max) {
    return Math.floor(Math.random() * Math.floor(Max));
}

//回転度数のランダム数値生成
function createRandom() {
    angleLength = 78;
    angleMax = 360;
    for (let i = 0; i < angleLength; i++) {
        angle.push(getRandomInt(angleMax));
    }
}

//背景色の描画
function draw_back() {
    caContext.drawImage(caBackImg, 0, 0, 2000, 2000, 0, 0, WIDTH, HEIGHT);
}

//仮想画面クリア
function clear_g() {
    gScreenContext.clearRect(0, 0, WIDTH, HEIGHT);
}

//実画面クリア
function clear_ca() {
    caContext.clearRect(0, 0, WIDTH, HEIGHT);
}

//カード初期表示
function drawInt_g() {
    clear_g();
    for (let i = 0; i < sCardNum; i++) {
        gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, centerX + gFlameMove, centerY - i, dCardWidth, dCardHeight);
    }
}
function drawInt_ca() {
    drawInt_g();
    clear_ca();
    draw_back();
    caContext.drawImage(gScreen, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
}

//初期表示→カードを開く(カードを閉じる)
function drawOpen_g() {
    clear_g();
    centerX = WIDTH / 2 - dCardWidth / 2;
    centerY = HEIGHT / 2 - dCardHeight / 2;
    for (let i = 0; i < cardNum; i++) {
        cardAngle = angle[i] * gFlameOpen;
        x = centerX + 100 - dCardWidth / 2 + moveX;
        y = centerY - dCardHeight / 2;
        cardCenterX = x + dCardWidth / 2;
        cardCenterY = y + dCardHeight / 2;
        gScreenContext.save();
        gScreenContext.translate(cardCenterX, cardCenterY);
        gScreenContext.rotate(Math.PI * (cardAngle) / 180);
        gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, 0, -sCardNum, dCardWidth, dCardHeight);
        gScreenContext.restore();
    }
}
function drawOpen_ca() {
    drawOpen_g();
    clear_ca();
    draw_back();
    caContext.drawImage(gScreen, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
}


//カード右回り
function draw_g() {
    clear_g();
    theta = Math.PI * (360 / cardNum) / 180 * gFlame / 500;
    for (let i = 0; i < 78; i++) {
        cardAngle = angle[i];
        x = centerX + ((radius / gFlameRadius) * Math.cos(theta * i));
        y = centerY + (radius / gFlameRadius * Math.sin(theta * i));
        cardCenterX = x;
        cardCenterY = y;
        gScreenContext.save();
        gScreenContext.translate(cardCenterX, cardCenterY);
        gScreenContext.rotate(Math.PI * cardAngle / 180);
        gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, 0, -sCardNum, dCardWidth, dCardHeight);
        gScreenContext.restore();
    }
}
function draw_ca() {
    draw_g();
    clear_ca();
    draw_back();
    caContext.drawImage(gScreen, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
}

//カードシャッフル
function drawSep_g() {
    clear_g();
    for (let i = 0; i < sCardNum; i++) {
        if (i < sCardNum / 2) {
            gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, centerX + gFlameMove, centerY - i - gFlameMoveY, dCardWidth, dCardHeight);
        } else {
            gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, centerX - gFlameMove, centerY - i + gFlameMoveY, dCardWidth, dCardHeight);
            // gScreenContext.globalCompositeOperation = "xor";
        }

    }
}
function drawSep_ca() {
    drawSep_g();
    clear_ca();
    draw_back();
    caContext.drawImage(gScreen, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
}

//カードシャッフル(ヤマ札の描画順変更)
function drawSepR_g() {
    clear_g();
    for (let i = 0; i < sCardNum; i++) {
        if (i === 7) {
            gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, centerX - gFlameMove, centerY - i + gFlameMoveY + gFlameMoveLY, dCardWidth, dCardHeight);
        } else if (!(i === 7) && i < sCardNum / 2) {
            gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, centerX - gFlameMove, centerY - i + gFlameMoveY, dCardWidth, dCardHeight);
            // gScreenContext.globalCompositeOperation = "xor";
        } else if (!(i === 7) && i > sCardNum / 2) {
            gScreenContext.drawImage(cardImage, 0, 0, cardWidth, cardHeight, centerX + gFlameMove, centerY - i - gFlameMoveY, dCardWidth, dCardHeight);
        }

    }
}
function drawSepR_ca() {
    drawSepR_g();
    clear_ca();
    draw_back();
    caContext.drawImage(gScreen, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
}



//起動イベント
window.onload = function () {
    ca = document.getElementById('canvas');
    ca.width = WIDTH;
    ca.height = HEIGHT;
    caContext = ca.getContext('2d');
    gScreen = document.createElement('canvas');
    gScreen.width = WIDTH;
    gScreen.height = HEIGHT;
    gScreenContext = gScreen.getContext('2d');
    loadImage();
    createRandom();
    caBackImg.onload = function () {
        drawInt_ca();
    }
}

//startアニメーション関数

//ヤマ札右移動
function aniMoveX() {
    startBtn.classList.add("btn-hide");
    let timerMove = setInterval(() => {
        gFlameMove++;
        drawInt_ca();
        if (gFlameMove > 100) {
            clearInterval(timerMove);
        }
    }, 10);
}

//ヤマ札を開く
function aniOpen() {
    let timerId = setInterval(function () {
        drawOpen_ca();
        gFlameOpen = gFlameOpen + 0.01;
        if (gFlameOpen > 1) {
            clearInterval(timerId);
        }
    }, 10);
}

//右回転
function aniRotate() {
    gFlame = 1;
    timerIdX = setInterval(function () {
        draw_ca();
        gFlame++;
        gFlameRotate = gFlameRotate - 0.005;
        // console.log(gFlameRotate);
    }, 10);
}

//回転半径収縮
function aniRotateS() {
    clearInterval(timerIdX);
    let timerId = setInterval(function () {
        draw_ca();
        gFlameRadius = gFlameRadius + 0.1;
        console.log(gFlameRadius);
        if (gFlameRadius > 20) {
            clearInterval(timerId);
        }
    }, 10);
}

//ヤマ札の開きを閉じる
function aniClose() {
    moveX = -100;
    let timerId = setInterval(function () {
        drawOpen_ca();
        gFlameOpen = gFlameOpen - 0.01;
        // console.log(gFlameOpen);
        if (gFlameOpen < -0.01) {
            clearInterval(timerId);
        }
    }, 10);
}

//初期状態のヤマ札を表示
function aniInit() {
    gFlameMove = 0;
    stopBtn.classList.add("btn-show");
    timerIdM = setInterval(() => {
        drawInt_ca();
    }, 10);
}

//start処理
function start() {
    aniMoveX();
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    sleep(1600)
        .then(() => aniOpen())
        .then(() => sleep(1000))
        .then(() => aniRotate())
        .then(() => sleep(10000))
        .then(() => aniRotateS())
        .then(() => sleep(2000))
        .then(() => aniClose())
        .then(() => sleep(1000))
        .then(() => aniInit())
}

//シャッフルアニメーション関数

//ヤマ札を二つに分ける
function aniSep() {
    stopBtn.classList.remove("btn-show");
    openBtn.classList.remove("btn-show");
    clearInterval(timerIdM);
    let timerId = setInterval(() => {
        gFlameMove++;
        drawSep_ca();
        if (gFlameMove > 50) {
            clearInterval(timerId);
        }
    }, 5);
}
//二つに分けたヤマ札の重ね順逆にしてY移動
function aniSepR() {
    let timerId = setInterval(() => {
        gFlameMoveY++;
        drawSepR_ca();
        if (gFlameMoveY > 50) {
            clearInterval(timerId);
        }
    }, 5);
}

//二つに分けたヤマ札を元のX座標へ移動
function aniSepX() {
    let timerId = setInterval(() => {
        gFlameMove = gFlameMove - 1;
        drawSepR_ca();
        if (gFlameMove < 1) {
            clearInterval(timerId);
        }
    }, 5);
}

//二つに分けたヤマ札を元のY座標へ移動
function aniSepY() {
    let timerId = setInterval(() => {
        gFlameMoveY = gFlameMoveY - 1;
        drawSepR_ca();
        if (gFlameMoveY < 1) {
            clearInterval(timerId);
        }
    }, 5);
}

//シャッフル処理
function stop() {
    aniSep();
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    sleep(500)
        .then(() => aniSepR())
        .then(() => sleep(500))
        .then(() => aniSepX())
        .then(() => sleep(500))
        .then(() => aniSepY())

        .then(() => sleep(500))
        .then(() => aniSep())
        .then(() => sleep(500))
        .then(() => aniSepR())
        .then(() => sleep(500))
        .then(() => aniSepX())
        .then(() => sleep(500))
        .then(() => aniSepY())

        .then(() => sleep(500))
        .then(() => aniSep())
        .then(() => sleep(500))
        .then(() => aniSepR())
        .then(() => sleep(500))
        .then(() => aniSepX())
        .then(() => sleep(500))
        .then(() => aniSepY())
        .then(() => sleep(500))
        .then(() => stopBtn.classList.add("btn-show"))
        .then(() => openBtn.classList.add("btn-show"))
}

//カードを切るアニメーション

//カードを一枚手前に移動
function aniMoveYs() {
    let timerId = setInterval(() => {
        gFlameMoveLY++;
        drawSepR_ca();
        if (gFlameMoveLY > dCardHeight + 10) {
            clearInterval(timerId);
        }
    }, 5);
}

//カードが表示
function cardShow() {
    cover.classList.add("cover-show");
    openCard.classList.add("card-show");
}

//カード裏面反転
function cardRotate(){
    let openCardSrc = document.querySelector(".card-img-src");
    openCardSrc.src = "./img/cardImg.png";
    let timerId = setInterval(()=>{
        degree ++;
        if(degree > 160){
            openCardSrc.src = "./img/openCard.png";
            openCardSrc.style.transform = 'rotateY(' + degree + 'deg)';
        }
        openCard.style.transform = 'rotateY(' + degree + 'deg)';
        console.log(degree);
        if(degree > 180){
            clearInterval(timerId);
        }
    },1)
}

//カードをめくる処理
function cut() {
    aniMoveYs();
    const sleep = ms => new Promise(resolve => setTimeout(resolve,ms))
    sleep(1000)
    .then(()=> cardShow())
    .then(()=> sleep(1000))
    .then(()=> cardRotate())
}

