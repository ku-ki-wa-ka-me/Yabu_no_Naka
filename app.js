var socket = io();

//チャットの送受信
$('form').submit(function () {
    socket.emit('msg', $('input').val());
    $('input').val('');
    return false;
});
socket.on('msg', function (data) {
    data = $('<div/>').text(data).html();
    $('div').prepend(data + '<br>');
});

