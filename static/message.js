$(document).ready(function() {

    $(".reply").click(function() {
        console.log($(this).data("me"));
    });
    $('.modal-trigger').leanModal();
    $(".send").click(function() {
        console.log($(this));
    })
});
$(".send").click(function() {
    var to = $("#to").val();
    var body = $("#body").val();
    var title = $("#title").val();
    var from = $("#name").data("n");
    body += " ~ " + from;
    $.ajax(
        "message/send", {
            method: "POST",
            data: {
                to: to,
                from: from,
                title: title,
                content: body
            },
            success: function(data, textStatus, garbage) {
                console.log("sent message");
                to = "";
                body = "";
                title = "";
                from = "";
            }
        }
    );
});