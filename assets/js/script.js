/* create array to store tasks to local data */
var tasksToday = [];

// set the values the schedule will start and end at
const startTime = 8;
const endTime = 18;

// build the schedule 
var buildSchedule = function() {
    // get parent element that will contain all rows
    var parent = $("#schedule");
    // generate a row for every hour between the start and end time
    for (i=startTime;i<(endTime+1);i++) {
        // build generic html for a single row
        var rowEl = $("<div>").addClass("time-block row justify-content-center no-gutters");
        var timeEl = $("<div>").addClass("col-1 border-top border-right border-bottom h-100 d-flex align-items-center justify-content-center");
        var timeP = $("<p>").addClass("ml-4 mb-0");
        var taskEl = $("<div>").addClass("col-9 d-flex");
        var taskTextarea = $("<textarea>").addClass("form-control");
        var saveEl = $("<div>").addClass("col-1 d-flex");
        var saveButton = $("<button>").addClass("saveBtn w-100").attr("id","saveBtn "+i.toString());
        var saveButtonSpan = $("<span>").addClass("oi oi-box m-0");
        // add row specific values
        var time = moment(i,"H").format("hA");
        timeP.text(time);
        taskTextarea.attr("id",time);
        // build row
        timeEl.append(timeP);
        taskEl.append(taskTextarea);
        saveButton.append(saveButtonSpan);
        saveEl.append(saveButton);
        rowEl.append(timeEl);
        rowEl.append(taskEl);
        rowEl.append(saveEl);

        parent.append(rowEl);
    };
}
// generate the schedule
buildSchedule();

// compare schedule rows against current time and set colors accordingly
var auditTask = function(taskEl) {
    var taskTime = $(taskEl).attr("id");
    var time = moment(taskTime,"hA").format("H");

    var now = moment().format("H");
    //var now = "13";

    //remove any existing colors
    $(taskEl).removeClass("past present future");

    // get difference in hours
    var diff = (time - now);

    if (diff > 0) {
        $(taskEl).addClass("future");
    } else if (diff == 0) {
        $(taskEl).addClass("present");
    } else if (diff < 0 ) {
        $(taskEl).addClass("past");
    };
}

// updates header to display the current day
var getCurrentDay = function() {
    // set current day 
    $("#currentDay").text(moment().format("dddd, MMMM Do"));
}

// save tasks to local object tasksToday
var saveTasks = function() {
    localStorage.setItem("tasksToday", JSON.stringify(tasksToday));
}

// loads tasks from local storage and updates schedule
var loadTasks = function() {
    getCurrentDay();
    tasksToday = JSON.parse(localStorage.getItem("tasksToday"));

    // if nothing in localStorage, create a new object
    if (!tasksToday) {
        tasksToday = [];
        var taskToday = {};
        for (i=startTime;i<(endTime+1);i++) {
            //convert military to 12h
            var taskTime = moment(i,"H").format("hA");
            taskToday = {
                time: taskTime,
                task: "" 
            };
            tasksToday[i] = taskToday;
        }
        console.log(tasksToday);
    } else {
        // assign each task from local storage to the appropriate time
        for (i in tasksToday) {
            if (tasksToday[i]) {
                createTask(tasksToday[i].time, tasksToday[i].task);
            }
        }
    }

    // check time relative to now and color code accordingly
    $(".form-control").each(function(index, el) {
        auditTask(el);
    });
}

// given the time and the text, update the textare of the appropriate line 
var createTask = function(time, text) {
    $("#"+time).val(text);
}

// updates local storage when save clicked
$(".saveBtn").on("click", function() {
    var textArea = $(this).closest(".row").find("textarea");
    // grab current text content
    var taskText = textArea.val().trim();
    var taskTime = textArea.attr("id");
    var idx = moment(taskTime,"hA").format("H");

    // update tasksToday array
    tasksToday[idx].task = taskText;
    tasksToday[idx].time = taskTime;
    saveTasks();
});

$(".form-control").on('blur',function(event) {
    // check if selected save button matches the row of the textarea edited
    var targetId = $(event.target).closest(".row").find(".saveBtn").attr("id");
    var selectedId = $(event.relatedTarget).attr("id");
    if (!event.relatedTarget || targetId != selectedId) {
        loadTasks();
    };
});


// load stored data when page is first opened
loadTasks();


// update row colors every 30 mins
setInterval(function() {
    $(".form-control").each(function(index, el) {
        auditTask(el);
    });
    getCurrentDay();
}, (1000 * 60) * 30);