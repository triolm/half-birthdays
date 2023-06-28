function main() {
  let birthdayCals = CalendarApp.getCalendarsByName("Birthdays")
  let cal = birthdayCals[1]

  let events = cal.getEvents(new Date(), oneYearFrom());

  for (let i of events) {
    let birthday = i.getAllDayStartDate()
    let halfBirthday = sixMonthsFrom(birthday)

    if (!verifyBirthdayTitle(i.getTitle())) {
      Logger.log("oh no")
      continue;
    }

    let halfBirthdayTitle = generateHalfBirthdayTitle(i.getTitle());


    let eventsThatDay = cal.getEventsForDay(halfBirthday);

    let exists = false;
    for (j of eventsThatDay) {
      if (j.getTitle() === halfBirthdayTitle) {
        exists = true
        break
      }
    }
    if(exists) continue;

    Logger.log(halfBirthdayTitle + " " + halfBirthday)
    let recurringHalfBirthday = cal.createAllDayEventSeries(halfBirthdayTitle, halfBirthday,
      CalendarApp.newRecurrence().addYearlyRule()).setColor(CalendarApp.EventColor.MAUVE)
  }

}

const verifyBirthdayTitle = (title) => {
  split = title.split(" ");
  if (split.length !== 2) return false;
  if (!(split[1].toLowerCase() === "birthday")) return false;
  return true;
}

const checkHalfBirthdayTitle = (birthdayTitle, halfBirthdayTitle) => {
  return (
    halfBirthdayTitle.toLowerCase() ===
    (birthdayTitle.split(" ")[0] + "Half-Birthday").toLowerCase()
  )

}

const generateHalfBirthdayTitle = (birthdayTitle) => {
  return birthdayTitle.split(" ")[0] + " Half-Birthday";
}

const oneYearFrom = (date = Date.now()) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  return d
}

const sixMonthsFrom = (date = Date.now()) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 6);
  return d
}


const verifyAllEventsRepeatAnually = () => {
  let birthdayCals = CalendarApp.getCalendarsByName("Birthdays")
  let cal = birthdayCals[1]

  let thisYear = cal.getEvents(new Date(), oneYearFrom());
  let nextYear = cal.getEvents(oneYearFrom(), oneYearFrom(oneYearFrom()));

  if (thisYear.length === nextYear.length) return true;
  Logger.log(thisYear.map(e => e.getTitle()))
  Logger.log(nextYear.map(e => e.getTitle()))
}


