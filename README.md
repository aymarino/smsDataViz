# SMS Data Visualization
### Using iPhone backup files to generate personal data tables & visualizations

This project is more of a toungue-in-cheek hack that takes advantage of the fact that iPhones, when backed up locally through iTunes, leave the archive of your SMS texts and contacts in a SQLite database in the backup folder.

The project itself gives instructions on uploading the databases, data from which are then prepared (with help from the SQL.js library), and an interactive table with various metrics is generated (using library functions from tablesorter.js) and a few D3.js visualizations are presented.

_Note:_ Ideally, this would be hosted on GitHub pages as a simple, _client-side only_ webpage (as I don't suspect anyone would be comfortable uploading a complete set of their texts and contacts to a stranger's shady backend server, including me), hence the use of Javascript exclusively for querying and interacting with the databases. However, it appears that uploaded files (or, at least, these files) to pages hosted via GitHub does not work.

So, the most straightforward way to run the project is to clone it and start it up on a localhost using a Python `SimpleHTTPServer`.

# Instructions
The location of the backup files are slightly different on Windows and OS X. On either platform, physically connect your iPhone and back it up locally using iTunes. Then:

### Windows
The backup folders are located at: `\Users\[username]\AppData\Roaming\Apple Computer\MobileSync\Backup\` (as is stated by [Apple](https://support.apple.com/en-us/HT204215))

### Mac
The backup folders are located at: `~/Library/Application Support/MobileSync/Backup/`.

The names files in the backup folders are MD5 hashes as follows:
* SMS archive: `3d0d7e5fb2ce288813306e4d4636395e047a3d28`
* Contacts: `31bb7ba8914766d4ba40d6dfb6113c8b614be442`

The page itself gives instructions on where to add each respective file.