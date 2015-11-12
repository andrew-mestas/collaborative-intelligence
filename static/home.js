$(document).ready(function() {
    $('#myTable').DataTable();
    var data = document.getElementsByClassName("table");
    if (data.length > 0) {
        $(".badge")[0].innerHTML = $("#messages").text();
        $(".badge")[1].innerHTML = $("#messages").text();
    }
    $(".question").hide();
    $(".answer").hide();
    $(".rank").hide();

    var addQuestions = function(answer, category) {

        $(".question").show();
        $(".category").hide();


        var question = $(".ques");
        if (question.length != 0) {
            for (var i = 0; i < question.length; i++) {
                question[i].remove();
            }
            $(".question").html("<h4>Questions</h4><hr>");
        }

        for (var i = 0; i < answer.length; i++) {
            var button = $("<a class=\"waves-effect waves-light btn ques\" data-go=\"" + answer[i].id + "\"data-cat=\"" + answer[i].categoryId + "\"\">");
            var data = $("<h6>");
            var question = answer[i].question;
            data.text(question);
            button.append(data);

            $(".question").append(button);
        }
    }
    var addAnswers = function(answer) {

        $(".question").hide();
        $(".answer").show();
        $(".rank").show();

        var answers = $(".answe");
        if (answers.length != 0) {
            for (var i = 0; i < answers.length; i++) {
                answers[i].remove();

            }
            $(".answer").html("<h4>Answer</h4><hr>");
            $(".rank").html("<h4>Ranks</h4><hr>");
        }

        for (var i = 0; i < answer.length; i++) {
            var button = $("<a class=\"waves-effect waves-light btn answe\">");
            var data = $("<h6>");
            var question = answer[i].answer;
            data.text(question);
            button.append(data);

            $(".answer").append(button);
            $(".answer").append("<br>");
            var button = $("<a class=\"waves-effect waves-light btn answe\">");
            var data = $("<h6>");
            var question = answer[i].rank;
            data.text(question);
            button.append(data);

            $(".rank").append(button);
            $(".rank").append("<br>");
        }
    }


    $(".cats").on("click", function() {
        var chips = $(".chip");
        var add = true;
        for (var i = 0; i < chips.length; i++) {
            if (chips[i].innerHTML == "Answer")
                add = false;
        }
        if (add) {
            $("#chips").append($("<div>").addClass("chip").html("Question"));
        }
        var id = $(this).data("go");

        $.ajax(
            "category/" + id, {
                method: "POST",
                success: function(data, textStatus, garbage) {
                    addQuestions(data, id);
                }
            }
        );
    });


    $("body").delegate(".ques", "click", function() {

        var chips = $(".chip");
        var add = true;
        for (var i = 0; i < chips.length; i++) {
            if (chips[i].innerHTML == "Answer")
                add = false;
        }
        if (add) {
            $("#chips").append($("<div>").addClass("chip").html("Answer"));
        }


        var id = $(this).data("go");
        var cat = $(this).data("cat");

        $.ajax(
            "question/" + id + "/" + cat, {
                method: "POST",
                success: function(data, textStatus, garbage) {
                    addAnswers(data);
                }
            }
        );
    });

    $("#chips").delegate(".chip", "click", function() {
        var enable = "." + $(this).html().toLowerCase();
        var tables = [".category", ".question", ".answer", ".rank"];

        for (var i = 0; i < 4; i++) {
            if (enable == tables[i]) {
                console.log(tables[i], i)
                if (i == 2) {
                    $(tables[i]).show();
                    $(tables[i + 1]).show();
                } else {
                    $(tables[i]).show();
                }
            } else {
                $(tables[i]).hide();
                if (enable == tables[2])
                    $(tables[3]).show();
            }
        }

    });

});