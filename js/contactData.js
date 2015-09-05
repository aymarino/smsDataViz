var BY_CONTACT = [];

var ContactHeaders = ['First Name', 'Last Name', 'Phone Number', 'Messages Sent',
                      'Messages Received', 'Total Messages', '# +/- %',
                      'Avg Sent Length', 'Avg Recieved Length', 'Avg Length', 'Length +/- %'];
var Contact = function(firstName, lastName, phoneNumber, numSent,
                       numRecieved, avgSentLength, avgRecLength) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;

  this.numSent = numSent;
  this.numRecieved = numRecieved;
  this.total = this.numSent + this.numRecieved;
  this.numPlusMinusPct = ((this.numRecieved - this.numSent) /
                          this.total * 100).toPrecision(4);

  this.avgSentLength = avgSentLength.toPrecision(4);
  this.avgRecLength = avgRecLength.toPrecision(4);
  this.avgLength = ((this.avgSentLength * this.numSent + this.avgRecLength * this.numRecieved) /
      this.total).toPrecision(4);
  this.lengthPlusMinusPct = ((Number(this.avgRecLength) - Number(this.avgSentLength)) /
      (Number(this.avgRecLength) + Number(this.avgSentLength)) * 100).toPrecision(4);
};

function importContactData() {
  for (var i = 0; i < uniqueNumbers.length; i++) {
    var number = uniqueNumbers[i][0];
    var firstName = "";
    var lastName = "";
    
    var numSent = uniqueNumbers[i][1];
    var numRecieved = uniqueNumbers[i][2];

    var avgSentLength = getAvgLength(number, true);
    var avgRecLength = getAvgLength(number, false);

    for (var j = 0; j < contacts.length; j++) {
      if (contacts[j][2] != null &&
          contacts[j][2].indexOf(number.toString()) != -1) {
        firstName = contacts[j][0];
        lastName = contacts[j][1];
      }
    }
    
    if ((firstName != "" && lastName != "") || numSent + numRecieved > 10) {
      var newContact = new Contact(firstName, lastName, number, numSent, 
                                   numRecieved, avgSentLength, avgRecLength);
      BY_CONTACT.push(newContact);
    }
  }

  createPieChart();
  populateMaster();
}

function getAvgLength(number, isFromMe) {
  var isFromMeBinary = "0";
  if (isFromMe) {
    var query = "\
      SELECT\
        AVG(LENGTH(text))\
      FROM\
        grouped\
      WHERE\
        numbers LIKE '%" + number + "%'\
        AND is_from_me=1";
  } else {
    var query = "\
      SELECT\
        AVG(LENGTH(text))\
      FROM\
        handle, message\
      WHERE\
        handle.ROWID=handle_id\
        AND handle.id='" + number +
        "' AND is_from_me=0";
  }
  dbReturn = messageDB.exec(query);
  var length = dbReturn[0].values[0][0];

  if (!length) return 0;
  return length;
}

function populateMaster() {
  if (BY_CONTACT.length == 0) return;

  var tableHead = document.getElementById("masterTableHead");
  var tableBody = document.getElementById("masterTableBody");

  var trHead = document.createElement('TR');
  for (var i = 0; i < ContactHeaders.length; i++) {
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode(ContactHeaders[i]));
    trHead.appendChild(th);
  }
  tableHead.appendChild(trHead);

  for (var i = 0; i < BY_CONTACT.length; i++) {
    var trBody = document.createElement('TR');
    for (var property in BY_CONTACT[0]) {
      var td = document.createElement('TD');
      td.appendChild(document.createTextNode(BY_CONTACT[i][property]));
      trBody.appendChild(td);
    }
    tableBody.appendChild(trBody);
  }

  $("#masterTable").tablesorter();
}