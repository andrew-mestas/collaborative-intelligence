var socket = io();

var colors = [{
    color: "#F7464A",
    highlight: "#FF5A5E",
}, {
    color: "#46BFBD",
    highlight: "#5AD3D1",
}, {
    color: "#FDB45C",
    highlight: "#FFC870",
}, {
    color: "#D927DC",
    highlight: "#F957FC",
}, {
    color: "#40B5D7",
    highlight: "#88CEE2",
}, {
    color: "#E57130",
    highlight: "#F7965F",
}];

var newData = [];
var length = $(".choices").length;
var valuesToAdd = [];
var val = $(".dataVals");
var toggle = true;

for (var i = 0; i < val.length; i++) {
    valuesToAdd.push(parseInt(val[i].getAttribute("data-val")));
}

console.log(valuesToAdd);
for (var i = 0; i < length; i++) {

    if (i !== "category" && i !== "question") {
        var addTo = {
            value: valuesToAdd[i],
            color: "",
            highlight: "",
            label: ""
        };
        addTo.label = $(".choices")[i].innerText;
        addTo.color = colors[i].color;
        addTo.highlight = colors[i].highlight;
        newData.push(addTo);
        var g = "#" + i.toString();
        $(g)[0].style.background = colors[i].color;
    }
};

var ctx = $("#myChart").get(0).getContext("2d");
var myDoughnutChart = new Chart(ctx).Doughnut(newData);

$(".clickable").click(function() {
    var location = $(this)[0].id;
    var pollId = $(".pollId").data("id");
    var update = pollId + "," + location + "," + newData[location].label;
    if (localStorage.getItem(pollId) == null || localStorage.getItem(pollId) == undefined) {
        if (toggle) {
            socket.emit('message', update);
            myDoughnutChart.segments[location].value++;
            myDoughnutChart.update();
            var button = $(".clickable");
            for (var i = 0; i < button.length; i++) {
                button[i].className += " disabled";
            }
            toggle = false;
            localStorage.setItem(pollId, true);
        }
    } else {
        Materialize.toast("You already voted cheater!", 5000);
    }

});

$(".closePoll").click(function() {
    socket.emit('closed', "This poll is now closed");
    window.open("/closePoll/" + $(this)[0].id.toString(), "_self");
});

socket.on('closed', function(msg) {
    Materialize.toast("This poll is closed", 5000);
    setTimeout(function() {
        window.open("/", "_self");
    }, 4000);

});

socket.on('This is broadcast', function(msg) {

    var newMsg = msg.split(",");
    console.log(newMsg);
    if (newMsg[0] == $(".pollId").data("id")) {
        var vals = msg.split(",");
        myDoughnutChart.segments[vals[1]].value++;
        myDoughnutChart.update();
    }

});