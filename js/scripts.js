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
