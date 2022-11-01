socket.on("pre",(kozin_num)=>{
    var kozin_num_cli = kozin_num;
    socket.emit("member",kozin_num_cli);
    document.getElementById("testtest").innerHTML = kozin_num;
});

socket.on("info",(rand_str)=>{
    document.getElementById("groop").innerHTML = rand_str;
});

socket.on("2komae",()=>{
    document.getElementById("testtest").innerHTML = "かわります";
});