$(function() {
    //マウスを乗せたら発動・赤く発行
    $('#victim_box div').hover(function() {
        //体用
        $(this).css({boxShadow:"0 0 1vw #bf4d28"});
        //頭用
        $(this).addClass('isActive');
    },function() {
        //マウスアウトで解除
        $(this).css({boxShadow:""});
        $(this).removeClass('isActive');
    });
});

$(function() {
    $("#victim_box div").click(function() {
        //クリックで点滅・2つ選択の変数作成
        $(this).toggleClass('v_choice');
        var v_count = $(".v_choice").length;

        if (v_count == 2  ) {
            //裏返した後、犯人1人を選択した
            $(".btn-nomi").css({pointerEvents: "auto",opacity: "1"});
        } else if (v_count == 4  ) {
            //2つ選ばれた
            $(".btn-flat-border").css({pointerEvents: "auto",opacity: "1"});
        } else {
            $(".btn-nomi").css({pointerEvents: "none",opacity: "0.3"});
            $(".btn-flat-border").css({pointerEvents: "none",opacity: "0.3"});
        }
    });
});

//選択した2つを回転
function spin() {
    //裏返し→犯人ボタンの動き
    $('.btn-flat-border').css({visibility:"hidden"});
    $('.btn-nomi').css({visibility:"visible"});
    //クラス名取得のためにidの変数を作成
    var VA_id = document.getElementById('VA'); var VA_turn = "";
    var VB_id = document.getElementById('VB'); var VB_turn = "";
    var VC_id = document.getElementById('VC'); var VC_turn = "";
    //どれを選んだか分析＋付与
    if( VA_id.classList.contains('v_choice') == true ){ VA_turn = "yes"; }
    if( VB_id.classList.contains('v_choice') == true ){ VB_turn = "yes"; }
    if( VC_id.classList.contains('v_choice') == true ){ VC_turn = "yes"; }
    //サーバへ情報を送る(どれがひっくり返されるか)///////////2つをひっくり返す
    socket.emit("victim_turn_num",{
        VA:VA_turn,
        VB:VB_turn,
        VC:VC_turn,
        heya_num:heya
    });
    //ひっくり返す
    $(".v_choice").addClass('turn');
    //選択解除
    $(".v_choice").removeClass('v_choice');
}

//犯人を指定
function nominate() {
    //クラス名取得のためにidの変数を作成
    var VA_id = document.getElementById('VA');
    var VB_id = document.getElementById('VB');
    var VC_id = document.getElementById('VC');
    //どれを選んだかでマークの置き場所変更
           if( VA_id.classList.contains('v_choice') == true ){
                    //目マークを犯人に置く
                    $('#human1_eye').animate({top:"16%",left:"34.5%"},500,"easeOutQuart");
    } else if( VB_id.classList.contains('v_choice') == true ){
                    $('#human1_eye').animate({top:"16%",left:"49.5%"},500,"easeOutQuart");
    } else if( VC_id.classList.contains('v_choice') == true ){
                    $('#human1_eye').animate({top:"16%",left:"64.5%"},500,"easeOutQuart");
    }
    
    var VA_spin = ""; var VB_spin = ""; var VC_spin = "";
    
    //どれを選んだか分析＋付与
    if( VA_id.classList.contains('v_choice') == true ){ VA_spin = "yes"; }
    if( VB_id.classList.contains('v_choice') == true ){ VB_spin = "yes"; }
    if( VC_id.classList.contains('v_choice') == true ){ VC_spin = "yes"; }
    //サーバへ情報を送る(犯人1人を選ぶ)///////////1つにマークを置く
    socket.emit("victim_spin_num",{
        VA_s:VA_spin,
        VB_s:VB_spin,
        VC_s:VC_spin,
        heya_num:heya
    });
    //[yes]項目の削除
    VA_spin = ""; VB_spin = ""; VC_spin = "";

    //選択解除
    $(".v_choice").removeClass('v_choice');
    //犯人マークのhidden
    $('.btn-nomi').css({visibility:"hidden"});

}

////////////////////////手番抑制のため犯人選択ボタンをhiddenに///////////////////////////////////
$(function() {
    $('.btn-flat-border').css({visibility:"hidden"});
});

//テスト用・白紙導入用
var unti = ["",3,4,5,6,7,8];
var tinko = unti[Math.floor(Math.random() * unti.length)];
console.log(tinko);
