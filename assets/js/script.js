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
        var rowEl = $("<div>").addClass("row justify-content-center no-gutters");
        var timeEl = $("<div>").addClass("col-1 border-top border-right border-bottom h-100 d-flex align-items-center justify-content-center");
        var timeP = $("<p>").addClass("ml-4 mb-0");
        var taskEl = $("<div>").addClass("col-9 d-flex");
        var taskTextarea = $("<textarea>").addClass("form-control");
        var saveEl = $("<div>").addClass("col-1 d-flex");
        var saveButton = $("<button>").addClass("saveBtn w-100").attr("id","saveBtn");
        var saveButtonSpan = $("<span>").addClass("oi oi-box m-0");
        // add row specific values
        var time = moment(i,"HH").format("hA");
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



// compare schedule rows against current time and set colors accordingly
var auditTask = function(taskEl) {
    var taskTime = $(taskEl).attr("id");
    var time = moment(taskTime,"hh a/A");
    
    //convert to military 
    time = time.format("HH");

    //var now = moment().format("HH");
    var now = "13";

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
            if (i < 12) {
                taskToday = {
                    time: (i + "AM"),
                    task: "" };
            } else if (i == 12) {
                taskToday = {
                    time: (i + "PM"),
                    task: "" };
            } else {
                taskToday = {
                    time: ((i-12) + "PM"),
                    task: "" };
            }
            tasksToday[i] = taskToday;
        }
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
    // grab current text content
    var taskText = $(this).closest(".row").find("textarea").val().trim();
    var taskTime = $(this).closest(".row").find("textarea").attr("id");
    var idx = taskTime.replace(/\D/g,'');
    var ampm = taskTime.replace(/[0-9]/g, '');

    // convert to military time
    if (ampm === "PM" && idx != 12) {
        idx = parseInt(idx) + 12;
    };

    // update tasksToday array
    tasksToday[idx].task = taskText;
    tasksToday[idx].time = taskTime;
    saveTasks();
});


// revert back to stored task if save button not clicked
$(".row").on("blur", function() {
    // load tasks
    loadTasks();
});

// generate the schedule
buildSchedule();


// load stored data when page is first opened
loadTasks();


// update row colors every 30 mins
setInterval(function() {
    $(".form-control").each(function(index, el) {
        auditTask(el);
    });
    getCurrentDay();
}, (1000 * 60) * 30);