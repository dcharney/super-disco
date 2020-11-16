/* create array to store tasks to local data */
var tasksToday = [];

// set the values the schedule will start and end at
const startTime = 8;
const endTime = 18;

// compare schedule rows against current time and set colors accordingly
// grey for past
// red for present
// green for future
var auditTask = function(taskEl) {
    var taskTime = $(taskEl).attr("id");
    var time = moment(taskTime,"hh a/A");
    
    //convert to military 
    time = time.format("HH");

    var now = moment().format("HH");
    //console.log(now);
    //set now to 1PM for test purposes
    //var now = "13";

    //remove any existing colors
    $(taskEl).removeClass("bg-secondary bg-success bg-danger");

    // get difference in hours
    var diff = (time - now);
    

    if (diff > 0) {
        $(taskEl).addClass("bg-success");
    } else if (diff == 0) {
        $(taskEl).addClass("bg-danger");
    } else if (diff < 0 ) {
        $(taskEl).addClass("bg-secondary");
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


// load stored data when page is first opened
loadTasks();

// update row colors every 30 mins
setInterval(function() {
    $(".form-control").each(function(index, el) {
        auditTask(el);
    });
    getCurrentDay();
}, (1000 * 60) * 30);