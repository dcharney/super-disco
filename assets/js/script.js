/* create array to store tasks to local data */
var tasksToday = [];

// set the values the schedule will start and end at
const startTime = 8;
const endTime = 18;

// create local object tasksToday
var saveTasks = function() {
    localStorage.setItem("tasksToday", JSON.stringify(tasksToday));
}

// loads tasks from local storage and updates schedule
var loadTasks = function() {
    tasksToday = JSON.parse(localStorage.getItem("tasksToday"));

    // if nothing in localStorage, create a new object
    if (!tasksToday) {
        console.log("hello!");
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