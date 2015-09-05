var loadingMessage = "Loading database..."
var instr0 = 'First, load "3d0d7e5fb2ce288813306e4d4636395e047a3d28"\
              into the first file submission box.'
var instr1 = 'Now, load "31bb7ba8914766d4ba40d6dfb6113c8b614be442"\
              into the second file submission box.'
var instr2 = 'Success. Click on one of the compilation buttons to see the\
              visualizations.'

var SQL = window.SQL;
var uniqueNumbers;
var contacts;
var dates;

var messageDB;
var contactDB;

function loadMessageDB(files) {
  var file = files[0];
  if (file.name != '3d0d7e5fb2ce288813306e4d4636395e047a3d28') return;

  document.getElementById("ready").innerHTML = loadingMessage;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '3d0d7e5fb2ce288813306e4d4636395e047a3d28', true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    var uInt8Array = new Uint8Array(this.response);
    messageDB = new SQL.Database(uInt8Array);

    uniqueNumbers = messageDB.exec("SELECT DISTINCT id FROM handle");
    uniqueNumbers = uniqueNumbers[0].values;

    messageDB.run("\
      CREATE TABLE grouped\
        (message_id char,\
        text char,\
        numbers char,\
        is_from_me char);\
    ");
    messageDB.run("\
      INSERT INTO grouped\
      SELECT * FROM\
        (SELECT\
          message_id,\
          message.text AS text,\
          numbers,\
          message.is_from_me AS is_from_me\
        FROM\
          (SELECT\
            message_id,\
            numbers\
          FROM\
            (SELECT\
              chat_id,\
              GROUP_CONCAT(id) AS numbers\
            FROM\
              (SELECT\
                chat_id,\
                handle_id,\
                handle.id\
              FROM chat_handle_join\
              INNER JOIN handle\
              ON chat_handle_join.handle_id=handle.ROWID)\
            GROUP BY chat_id)\
        AS B\
        INNER JOIN chat_message_join\
        ON B.chat_id=chat_message_join.chat_id)\
      AS C\
      INNER JOIN message\
      ON C.message_id=message.ROWID)\
    ");

    for (var i = 0; i < uniqueNumbers.length; i++) {
      var id = uniqueNumbers[i][0];
      var messageCount = messageDB.exec("\
        SELECT\
          SUM(is_from_me=1) AS send\
        FROM\
          grouped\
        WHERE\
          numbers LIKE '%" + id + "%'"
      );
      uniqueNumbers[i].push(messageCount[0].values[0][0]);

      messageCount = messageDB.exec("\
        SELECT\
          SUM(message.is_from_me=0) AS rec\
        FROM message, handle\
        WHERE handle.ROWID=handle_id\
          AND id LIKE '%" + id + "'"
      );
      uniqueNumbers[i].push(messageCount[0].values[0][0]);
    }

    document.getElementById("ready").innerHTML = instr1;
  }
  xhr.send();
}

function loadAddrDB(files) {
  var file = files[0];
  if (file.name != '31bb7ba8914766d4ba40d6dfb6113c8b614be442') return;

  document.getElementById('ready').innerHTML = loadingMessage;

  var addrBook = new XMLHttpRequest();
  addrBook.open('GET', '31bb7ba8914766d4ba40d6dfb6113c8b614be442', true);
  addrBook.responseType = 'arraybuffer';

  addrBook.onload = function(e) {
    var uInt8Array = new Uint8Array(this.response);
    contactDB = new SQL.Database(uInt8Array);
    contacts = contactDB.exec("\
      SELECT\
        c0First,\
        c1Last,\
        c15phone\
      FROM\
        ABPersonFullTextSearch_content");
    contacts = contacts[0].values;
    document.getElementById('ready').innerHTML = instr2;
    document.getElementById('buttons').style.visibility = 'visible';
  }
  addrBook.send();
}
