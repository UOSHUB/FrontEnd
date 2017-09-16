function $(selector) {
    return angular.element(document.querySelector(selector));
}

function currentTerm() {
    var date = new Date(), month = date.getMonth() + 1;
    return date.getFullYear() + (month > 7 ? '10' : month < 6 ? '20' : '30');
}

function structureCourse(course, id) {
    return {
        name: course.name,
        columns: [
            [
                ['Doctor Name', course.doctor[0], 'user'],
                ['Days', course.days.join(' '), 'calendar-o'],
                ['Start Time', course.time[0], 'hourglass-start'],
                ['Section', course.section, 'puzzle-piece', '(Section)'],
                ['Course key', id, 'key']
            ], [
                ['Doctor Email', course.doctor[1], 'envelope'],
                ['Building, Room', course.place.join(', '), 'map-marker'],
                ['End Time', course.time[1], 'hourglass-end'],
                ['Credit Hours', course.ch, 'certificate', '(CrHrs)'],
                ['CRN', course.crn, 'info']
            ]
        ]
    };
}

var switchDay = {'U': 0, 'M': 1, 'T': 2, 'W': 3, 'R': 4, 'F': 5, 'S': 6},
    topShift = 5, leftShift = 5, columnWidth = 19,
    maxTime, minTime, hoursCount, rowHeight,
    colors = ["red", "teal", "green", "orange",
              "purple", "light-blue", "brown",
              "yellow", "deep-orange", "blue"];

function colorAndTime(course, index) {
    course.color = colors[index];
    var start = toMinutes(course.start),
        end = toMinutes(course.end);
    if(start < minTime) minTime = start;
    if(end > maxTime) maxTime = end;
    course.length = (end - start) / 60;
}

function toMinutes(timeString) {
    var time = timeString.replace(':', ' ').split(' ');
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
        labels.push({hour, period});
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
    var date = new Date(), dates = [],
        month = date.getMonth(),
        year = date.getFullYear(),
        startDay = date.getDate() - date.getDay() + (date.getDay() < 5 ? 0 : 7);
    for (var i = 0; i < 5; i++)
        dates.push(new Date(year, month, startDay + i).toLocaleDateString().slice(0, -5));
    return dates;
}