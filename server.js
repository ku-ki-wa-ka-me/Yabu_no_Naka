var html = require('fs');

//html使用のため
const indexHtml =html.readFileSync('./index.html')
//css使用のため
const resetCss =html.readFileSync('./css/reset.css')
const styleCss =html.readFileSync('./css/style.css')
//js使用のため
const scriptJs =html.readFileSync('./js/script.js')

//テスト中
const robbyHtml =html.readFileSync('./robby.html')
const test3Js =html.readFileSync('./routes/test3.js')
//テスト中


var http = require('http').createServer(
    function (req, res) {

        switch (req.url) {
                //html使用のため
            case '/':
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(robbyHtml);
                res.end();
                break;
                
                //テスト中
            case '/index.html':
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(indexHtml);
                res.end();
                break;
                //激熱
            case '/unti':
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(indexHtml);
                res.end();
                break;
            case '/routes/test3.js':
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(test3Js);
                res.end();
                break;
                //テスト中
                
                //css使用のため
            case '/css/reset.css':
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(resetCss);
                res.end();
                break;
                
            case '/css/style.css':
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(styleCss);
                res.end();
                break;
                
                //js使用のため
            case '/js/script.js':
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(scriptJs);
                res.end();
                break;
                
            default:
                break;
        }
    });

var io = require('socket.io')(http);
var webPort = process.env.PORT || 3000;
http.listen(webPort);

////////////////////////////////////////////////////関数等の事前準備///////////////////////////////////
let matti = [];
///////////////////部屋割り用//////////
myPlay = [];   //部屋ごとの数字用
max_index = [];//部屋ごとの犯人用
Battle = [];   //部屋ごとのID用
var heya = 0;
turn = [];     //部屋ごとのターン用

//////////////////ダメージ用カウンター///////////////////////
VA_point = [];
VB_point = [];
VC_point = [];
//////////////////ダメージ用カウンター///////////////////////
//////////////////////////////////////////犯人ボタンの累積///////////////////////
function counter(id,msg) {
    if ( msg.VA_s == "yes" ) {
        VA_point[msg.heya_num][0] = id;
        VA_point[msg.heya_num][1]++;
    } else if( msg.VB_s == "yes" ) {
        VB_point[msg.heya_num][0] = id;
        VB_point[msg.heya_num][1]++;
    } else if( msg.VC_s == "yes" ) {
        VC_point[msg.heya_num][0] = id;
        VC_point[msg.heya_num][1]++;
    } else {}
}
//////////////////////////////////////////ミスダメージの送信//////////////////////
function miss() {
      if (max_index == 3) {
          io.to(VB_point[0]).emit("miss",{ num:VB_point[1] });
          io.to(VC_point[0]).emit("miss",{ num:VC_point[1] });
}else if (max_index == 4) {
          io.to(VA_point[0]).emit("miss",{ num:VA_point[1] });
          io.to(VC_point[0]).emit("miss",{ num:VC_point[1] });
}else if (max_index == 5) {
          io.to(VA_point[0]).emit("miss",{ num:VA_point[1] });
          io.to(VB_point[0]).emit("miss",{ num:VB_point[1] });
}else {}
}
//////////////////////////////////////////ミスダメージの送信(全員分)//////////////////////
function damage(miss_id , heyaban) {
           if (miss_id[0] == Battle[heyaban][0]) {
        io.to(Battle[heyaban][0]).emit("missB",{ num:miss_id[1] });
        io.to(Battle[heyaban][1]).emit("missR",{ num:miss_id[1] });
        io.to(Battle[heyaban][2]).emit("missL",{ num:miss_id[1] });
    } else if (miss_id[0] == Battle[heyaban][1]) {
        io.to(Battle[heyaban][0]).emit("missL",{ num:miss_id[1] });
        io.to(Battle[heyaban][1]).emit("missB",{ num:miss_id[1] });
        io.to(Battle[heyaban][2]).emit("missR",{ num:miss_id[1] });
    } else if (miss_id[0] == Battle[heyaban][2]) {
        io.to(Battle[heyaban][0]).emit("missR",{ num:miss_id[1] });
        io.to(Battle[heyaban][1]).emit("missL",{ num:miss_id[1] });
        io.to(Battle[heyaban][2]).emit("missB",{ num:miss_id[1] });
    }else {}    
}
////////////////////////////////////////////////////関数等の事前準備///////////////////////////////////

//サイトに接続した
io.on('connection',function (socket) {
    
    let id = socket.id;
    matti.push(id);
        //接続した
        console.log('こいつが接続した：' + id);
        console.log(matti);
        //コメント送信用
        socket.on('msg',function (data) {
                io.emit('msg', data);
            });
        //切断した
        socket.on('disconnect', () => {
        console.log('こいつが抜けた：' + id);
            //抜けた人が待機中の場合
            if (matti.includes(id) == true) {
                
                var index = matti.indexOf(id);
                matti.splice(index, 1)

                console.log(matti);
            //抜けた人が試合中の場合
            } else { 
                console.log(matti);
                ///////////////////////////////////部屋の解散用/////////////////////////////
                Battle.forEach( (row, i) => {
                    row.forEach( (element, j) => {
                        if(element === id) {
                            console.log(i, j) ; //Battleの配列番号,その中の配列番号
                            io.to(Battle[i][0]).emit("go-robby"); //ロビーへ移動
                            io.to(Battle[i][1]).emit("go-robby");
                            io.to(Battle[i][2]).emit("go-robby");
                        }
                    });
                });
                ///////////////////////////////////部屋の解散用/////////////////////////////
            }
            });
    
    
        //三人そろった
        if (matti.length == 3  ) {
        console.log("整いました");
/////////////////////////////////////////カードシャフル////////////////////////////////////////////////////////////////////
            myData = new Array(6);
            //human1
            myData[0] = 3;
            //human3(左隣)
            myData[1] = 4;
            //human2(右隣)
            myData[2] = 5;
            //victimA(左)
            myData[3] = 6;
            //victimB
            myData[4] = 7;
            //victimC
            myData[5] = 8;
            
            myFree = new Array(6);
            for (i=0; i<6; i++) myFree[i] = myData[i];
/////////////////////////////////////////myPlay[heya]でシャッフル/////////////////////////////  
            myPlay[heya] = myData.concat();
            //シャッフル(500回)
            for (i=0; i<500; i++){ // 500回 myPlay の内容をシャッフルする
                myA = Math.floor( Math.random() * 6 ); // 0～ を決める
                myB = Math.floor( Math.random() * 6 ); // 0～ を決める
                myBackup = myPlay[heya][myA];      // myPlay の myA番目とmyB番目の内容を入れ替える
                myPlay[heya][myA] = myPlay[heya][myB];
                myPlay[heya][myB] = myBackup;
            }
////////////////////////////////////////mattiのIDをBattleへ移行////////////////////////
            Battle[heya] = matti.concat();
////////////////////////////////////////ダメカンの新規作成//////////////////////////////
            VA_point[heya] = ["", 0];
            VB_point[heya] = ["", 0];
            VC_point[heya] = ["", 0];
////////////////////////////////////////ターン用の新規作成//////////////////////////////
            turn[heya] = 0;
            /////////////////////////////////////////スタート@手札・部屋番の配布////////////////////////////////////////////////////////////////////
            io.to(matti[0]).emit("start_card_0",{
                myCard:myPlay[heya][0],rightCard:myPlay[heya][2],heya_num:heya
            });
            io.to(matti[1]).emit("start_card_1",{
                myCard:myPlay[heya][1],rightCard:myPlay[heya][0],heya_num:heya
            });
            io.to(matti[2]).emit("start_card_2",{
                myCard:myPlay[heya][2],rightCard:myPlay[heya][1],heya_num:heya
            });         
            //////////////////犯人の選定///////////////////////
            var myPlay_vic = myPlay[heya].slice(3);
            var max = myPlay_vic.reduce(function(a,b){
                return Math.max(a,b);
            });
            max_index[heya] = myPlay[heya].indexOf(max);
            
            console.log("部屋番："+heya);
            console.log(myPlay[heya]);
            console.log(Battle); //→犯人
            //////////////////犯人の選定///////////////////////
    ///////////////////////////手番の選定・手番以外の操作抑制//////////////////////////////////
            io.to(matti[0]).emit("teban");
    ///////////////////////////手番の選定・手番以外の操作抑制//////////////////////////////////
            ////////終了処理////////////
            heya++;　　 //IDと数字が移行したため[heya]数字UP
            matti = [];//配列を初期化します
    };
    
    
    //ひっくり返されるvictimの精査//サーバへ情報を送る(どれがひっくり返されるか)///////////2つをひっくり返す
    socket.on("victim_turn_num",function(msg) {
        var VA_num = "";
        var VB_num = "";
        var VC_num = "";
        if( msg.VA == "yes" ){ VA_num = myPlay[msg.heya_num][3]; }//myFreeが読み込まれません＝＝＝ごめん三人そろってないからだ
        if( msg.VB == "yes" ){ VB_num = myPlay[msg.heya_num][4]; }
        if( msg.VC == "yes" ){ VC_num = myPlay[msg.heya_num][5]; }
    //戻し
    io.to(id).emit("victim_turn_num-2",{
        VA:VA_num,
        VB:VB_num,
        VC:VC_num   
    });  
    });
    //ひっくり返されるvictimの精査//サーバへ情報を送る(どれがひっくり返されるか)///////////2つをひっくり返す
    
    
    
    //犯人指定の際のvictimの精査//サーバへ情報を送る(犯人1人を選ぶ)///////////1つにマークを置く
    socket.on("victim_spin_num",function(msg) {
        turn[msg.heya_num]++;
        //戻し
               if (id == Battle[msg.heya_num][0]) {
            counter(id,msg);
                   io.to(Battle[msg.heya_num][1]).emit("R" , msg);
                   io.to(Battle[msg.heya_num][2]).emit("L" , msg);
                            if (turn[msg.heya_num] != 3) {
                                io.to(Battle[msg.heya_num][1]).emit("teban");
                            } else {
                                setTimeout(() => {io.to(Battle[msg.heya_num][2]).emit("teban");}, 5000);
                            } 
        } else if (id == Battle[msg.heya_num][1]) {
            counter(id,msg);
                    io.to(Battle[msg.heya_num][0]).emit("L" , msg);
                    io.to(Battle[msg.heya_num][2]).emit("R" , msg);
                            if (turn[msg.heya_num] != 3) {
                                io.to(Battle[msg.heya_num][2]).emit("teban");
                            } else {
                                setTimeout(() => {io.to(Battle[msg.heya_num][0]).emit("teban");}, 5000);
                            }
        } else if (id == Battle[msg.heya_num][2]) {
            counter(id,msg);
                    io.to(Battle[msg.heya_num][0]).emit("R" , msg);
                    io.to(Battle[msg.heya_num][1]).emit("L" , msg);
                            if (turn[msg.heya_num] != 3) {
                                io.to(Battle[msg.heya_num][0]).emit("teban");
                            } else {
                                setTimeout(() => {io.to(Battle[msg.heya_num][1]).emit("teban");}, 5000);
                            }
        } else {}  
        
        //3人ターンが終わった⇒開示
        if (turn[msg.heya_num] == 3) {
            VA_num = myPlay[msg.heya_num][3];　VB_num = myPlay[msg.heya_num][4];　VC_num = myPlay[msg.heya_num][5];
            io.to(Battle[msg.heya_num][0]).emit("victim_turn_num-2",{ VA:VA_num, VB:VB_num, VC:VC_num }); //犯人の数字を配布用
            io.to(Battle[msg.heya_num][1]).emit("victim_turn_num-2",{ VA:VA_num, VB:VB_num, VC:VC_num });
            io.to(Battle[msg.heya_num][2]).emit("victim_turn_num-2",{ VA:VA_num, VB:VB_num, VC:VC_num });
            io.to(Battle[msg.heya_num][0]).emit("cri-open"); //容疑者回転用
            io.to(Battle[msg.heya_num][1]).emit("cri-open"); 
            io.to(Battle[msg.heya_num][2]).emit("cri-open");
            setTimeout(() => {io.to(Battle[msg.heya_num][0]).emit("syoki");}, 7000); //犯人マークの再配置用(時間差)
            setTimeout(() => {io.to(Battle[msg.heya_num][1]).emit("syoki");}, 7000);
            setTimeout(() => {io.to(Battle[msg.heya_num][2]).emit("syoki");}, 7000); 
            
                  if (max_index[msg.heya_num] == 3) {
                      damage(VB_point[msg.heya_num] , msg.heya_num);
                      damage(VC_point[msg.heya_num] , msg.heya_num);
            }else if (max_index[msg.heya_num] == 4) {
                      damage(VA_point[msg.heya_num] , msg.heya_num);
                      damage(VC_point[msg.heya_num] , msg.heya_num);
            }else if (max_index[msg.heya_num] == 5) {
                      damage(VA_point[msg.heya_num] , msg.heya_num);
                      damage(VB_point[msg.heya_num] , msg.heya_num);
            }else {}
        ///////////////////////////////////次のラウンドへの準備/////////////////////////////////
            turn[msg.heya_num] = 0;
            //setTimeout(() => {io.to(matti[0]).emit("test");}, 5000);
        ///////////////////////////////////次のラウンドへの準備/////////////////////////////////
        } else {}
});
    //犯人指定の際のvictimの精査//サーバへ情報を送る(犯人1人を選ぶ)///////////1つにマークを置く
    
});









