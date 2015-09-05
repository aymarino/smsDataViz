var BY_DATE = [];
var BY_WEEK = [];
var BY_MONTH = [];

var DateEntry = function(in_date, in_sent, in_received) {
  this.date = in_date;
  this.numSent = in_sent;
  this.numReceived = in_received;
  this.total = this.numSent + this.numReceived;
}

function importDateData() {
  var dateCount = messageDB.exec("\
    SELECT\
      SUM(is_from_me=1) AS sent,\
      SUM(is_from_me=0) AS rec,\
      date(date + 978307200, 'unixepoch', 'localtime') as day\
    FROM message\
    GROUP BY day\
    ORDER BY day ASC");
  dateCount = dateCount[0].values;

  var prev = parseDate(dateCount[0][2]);
  prev.setTime(prev.getTime() - 86400000);
  for (var i = 0; i < dateCount.length; i++) {
    var date = parseDate(dateCount[i][2]);
    var numSent = dateCount[i][0];
    var numReceived = dateCount[i][1];

    var newDate = new DateEntry(date, numSent, numReceived);
    while (prev.getTime() < newDate.date.getTime() - 86400000) {
      prev.setTime(prev.getTime() + 86400000);
      var fillDate = new DateEntry(new Date(prev.getTime()), 0, 0);
      BY_DATE.push(fillDate);
    }
    BY_DATE.push(newDate);
    prev.setTime(newDate.date.getTime());
  }

  BY_WEEK = binBy(BY_DATE, 7);
  BY_MONTH = binBy(BY_DATE, 31);

  createLineChart(BY_DATE, "Number of texts vs. time, daily bins");
  createLineChart(BY_WEEK, "Number of texts vs. time, weekly bins");
  createLineChart(BY_MONTH, "Number of texts vs. time, monthly bins");
}

function parseDate(in_date) {
  var components = in_date.split('-');
  return new Date(components[0], components[1] - 1, components[2]);
}

function binBy(dateData, numDays) {
  var bin = [];

  var dayCount = 0;
  var totalSent = 0;
  var totalRecieved = 0;
  for (var i = 0; i < dateData.length; i++) {
    totalSent += dateData[i].numSent;
    totalRecieved += dateData[i].numReceived;
    if (dayCount == numDays) {
      var newDate = new DateEntry(dateData[i].date, totalSent, totalRecieved);
      bin.push(newDate);

      dayCount = 0;
      totalSent = 0;
      totalRecieved = 0;
    }
    dayCount++;
  }

  return bin;
}
