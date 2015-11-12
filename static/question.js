var toggle = true;
$(document).ready(function() {
    $("#sub").hide();

    $("#numQ").click(function(e) {
        e.preventDefault();
        if (toggle) {
            toggle = false;
            var val = $("#slide").val();

            for (var i = 0; i < val; i++) {
                var more = $("<div class=\"row\"><div id=\"addToThis\"class=\"input-field col s12\"></div></div>");
                var add = $("<input id=\"question" + i + "\"type=\"text\" class=\"validate\" \"required=\"\" aria-required=\"true\">").attr("name", "choice" + i);
                $("#addToThis").append(more).append(add);
            }
            $("#numQ").addClass("disabled");
            $("#sub").show(1000);
        }
    });

    $("ul").on("click", "a", function() {
        $("#category").val($(this).html());

    });
});