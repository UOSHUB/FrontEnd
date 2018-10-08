var days = ["U", "M", "T", "W", "R", "F", "S"], today = new Date(), month = today.getMonth() + 1,
    year = today.getFullYear(), term = month > 7 ? year + "10" : year - 1 + (month < 6 ? "20" : "30"),
    body = $("body"), maxTime, minTime, hoursCount, colors = [
        "red", "teal", "green", "orange", "purple",
        "light-blue", "brown", "yellow", "deep-orange", "blue"
    ];

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.url = function() {
    return "/static/cards/" + this + ".html";
};

//if("serviceWorker" in navigator)
//    window.addEventListener("load", function() {
//        navigator.serviceWorker.register("/static/worker.js").then(nothing, error);
//    });

function nothing() {}

function error(message) {
    console.log("The following error occured:", message);
}

function $(selector) {
    return angular.element(document.querySelectorAll(selector));
}

function parseDate(date) {
    return new Date(date);
}

function getInitials(name) {
    if(!name) return;
    var words = name.split(" ");
    return (
        words[1] ?
        words[0].slice(0, 1) + words[1].slice(0, 1):
        words[0].slice(0, 2)
    ).toUpperCase();
}

function structureCourse(course, id) {
    return {
        title: course.title,
        color: course.color,
        columns: [
            [
                ["Doctor Name", course.doctor, "user"],
                ["Days", course.days, "calendar-o"],
                ["Start Time", course.start, "hourglass-start"],
                ["Section", course.section, "puzzle-piece", "(Section)"],
                ["Course key", id, "key"]
            ], [
                ["Doctor Email", course.email, "envelope"],
                ["Building, Room", course.location, "map-marker"],
                ["End Time", course.end, "hourglass-end"],
                ["Credit Hours", course.ch, "certificate", "(CrHrs)"],
                ["CRN", course.crn, "info"]
            ]
        ]
    };
}

function processSchedule(courses, termData) {
    termData.courses = [];
    maxTime = 0; minTime = 24 * 60;
    var rowHeight, topShift = 5, leftShift = 5, columnWidth = 19, index = -1;
    angular.forEach(courses, function(course, id) {
        termData.courses.push(id);
        if(course.start) {
            colorAndTime(course, ++index);
            if("lab" in course) {
                var copy = angular.copy(course);
                angular.extend(copy, copy.lab, {lab: true});
                if(!copy.title.includes("Lab"))
                    copy.title += " Lab";
                colorAndTime(copy, index);
                courses[id + "-lab"] = copy;
                termData.courses.push(id + "-lab");
                delete course.lab;
            }
        }
    });
    maxTime += 30; minTime -= 30;
    hoursCount = (maxTime - minTime) / 60;
    rowHeight = (100 - topShift) / hoursCount;
    angular.forEach(courses, function(course) {
        if(course.start) {
            course.points = [];
            var y = topShift + rowHeight * (toMinutes(course.start) - minTime) / 60;
            angular.forEach(course.days, function(day) {
                course.points.push({x: leftShift + days.indexOf(day) * columnWidth, y: y});
            });
        }
    });
    angular.extend(termData, {
        height: rowHeight,
        labels: hoursLabels(),
        fractions: hoursFractions(),
        dates: dates()
    });
    return courses;
}

function colorAndTime(course, index) {
    course.color = colors[index];
    var start = toMinutes(course.start),
        end = toMinutes(course.end);
    if(start < minTime) minTime = start;
    if(end > maxTime) maxTime = end;
    course.length = (end - start) / 60;
}

function toMinutes(timeString) {
    var time = timeString.replace(":", " ").split(" ");
    return Number(time[0]) * 60 + Number(time[1]) + (time[2] == "PM" && time[0] != "12" ? 720 : 0);
}

function hoursLabels() {
    var beginning = (minTime + 60 - minTime % 60) / 60,
        end = (maxTime - maxTime % 60) / 60, labels = [],
        hour, period = (beginning < 12 ? "AM" : "PM");
    for(var i = beginning; i <= end; i++) {
        if(i == 12) {
            period = (period == "PM" ? "AM" : "PM");
            hour = 12;
        } else hour = i % 12;
        labels.push({hour: hour, period: period});
    }
    return labels;
}

function hoursFractions() {
    var fractions = [], subHour = minTime % 60 / 60,
        firstBit = (subHour > 0 ? subHour : 1);
    fractions.push(firstBit);
    var remaining = hoursCount - firstBit;
    for(var i = 1; i < remaining; i++)
        fractions.push(1 + fractions.slice(-1)[0]);
    if(remaining % 1 > 0.5) fractions.push(-1);
    return fractions;
}

function dates() {
    var dates = [], startDay = today.getDate() - today.getDay() + (today.getDay() < 5 ? 0 : 7);
    for (var i = 0; i < 5; i++)
        dates.push(new Date(year, month - 1, startDay + i).toLocaleDateString().slice(0, -5));
    return dates;
}