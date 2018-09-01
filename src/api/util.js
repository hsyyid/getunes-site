export function millisecondsToTime(millisec) {
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = Math.floor(seconds / 60);

  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10)
    ? seconds
    : "0" + seconds;

  return minutes + ":" + seconds;
}

export function getGreeting() {
  let myDate = new Date();
  let hrs = myDate.getHours();

  let greet = 'day';

  if (hrs < 12) {
    greet = 'morning';
  } else if (hrs >= 12 && hrs <= 17) {
    greet = 'afternoon';
  } else if (hrs >= 17 && hrs <= 24) {
    greet = 'evening';
  }

  return greet;
}
