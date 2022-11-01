let matti = [];
let play  = [];
var kozin_num = 0;

//3人揃ったら一度、3人へ返す
if (matti.length == 3  ) {
    saikoro(); //関数みといて(tagiron)
    console.log("揃った");
    io.to(matti[0]).emit('pre',kozin_num);
    kozin_num++;
    io.to(matti[1]).emit('pre',kozin_num);
    kozin_num++;
    io.to(matti[2]).emit('pre',kozin_num);
    kozin_num++;

    play = play.concat(matti);
}
//その後3人から返答、グループ化
socket.on('member',(kozin_num_cli)=>{
    socket.join(rand_str);
    io.sockets.in(rand_str).emit("info",rand_str);
    matti = [];//配列を初期化します
    if(kozin_num_cli % 3 == 2) {
        console.log("test");
        io.to(play[kozin_num_cli-1]).emit("2komae");
    }
});