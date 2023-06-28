function main() {
  let birthdayCals = CalendarApp.getCalendarsByName("Birthdays")
  //for some reason it's the second one
  //maybe because i had another and deleted it?
  let cal = birthdayCals[1]

  let events = cal.getEvents(new Date(), oneYearFrom());

  for (let i of events) {
    let birthday = i.getAllDayStartDate()
    //calcualte six months after birthday
    //this might not work in some cases e.g. aug 30 -> feb 30?
    let halfBirthday = nearestSixMonthsFrom(birthday)

    if (!verifyBirthdayTitle(i.getTitle())) {
      Logger.log("half birthday event already exists skipping...")
      continue;
    }

    //title of calendar event
    let halfBirthdayTitle = generateHalfBirthdayTitle(i.getTitle());

    //get all events on the half birthday to see if it has already been added to calendar
    let eventsThatDay = cal.getEventsForDay(halfBirthday);
    let exists = false;
    for (j of eventsThatDay) {
      if (j.getTitle() === halfBirthdayTitle) {
        exists = true
        break
      }
    }
    if (exists) continue; 

    //create calendar event
    Logger.log(halfBirthdayTitle + " " + halfBirthday)
    let recurringHalfBirthday = cal.createAllDayEventSeries(halfBirthdayTitle, halfBirthday,
      CalendarApp.newRecurrence().addYearlyRule()).setColor(CalendarApp.EventColor.MAUVE)
  }

}

//make sure something is a valid (normal) birthday event title
const verifyBirthdayTitle = (title) => {
  split = title.split(" ");
  if (split.length !== 2) return false;
  if (!(split[1].toLowerCase() === "birthday")) return false;
  return true;
}

//make sure something is a valid half birthday event title
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
const oneYearBefore = (date = Date.now()) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() - 1);
  return d
}

const sixMonthsFrom = (date = Date.now()) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 6);
  return d
}

//six months from the date in whichever direction is closest to the current date
const nearestSixMonthsFrom = (date = Date.now()) => {
  const first = sixMonthsFrom(oneYearBefore(date))
  if(Date.now() - 24 * 1000 * 60 * 60 < first.valueOf()) return first;
  const second = sixMonthsFrom(date);
  return second
}

//check if there are the same number of birthday events between years
const verifyAllEventsRepeatAnually = () => {
  let birthdayCals = CalendarApp.getCalendarsByName("Birthdays")
  let cal = birthdayCals[1]

  let thisYear = cal.getEvents(new Date(), oneYearFrom());
  let nextYear = cal.getEvents(oneYearFrom(), oneYearFrom(oneYearFrom()));

  if (thisYear.length === nextYear.length) return true;

  Logger.log(thisYear.map(e => e.getTitle()))
  Logger.log(nextYear.map(e => e.getTitle()))
  throw new Error("Event mismatch between years")
}



