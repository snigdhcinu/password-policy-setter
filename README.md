# backup-mongo-to-s3
A simple interface module that creates password-policy for your application.

# INTRODUCTION

This module is a simple alternate to creating complex native Regex, or tidious multidimensional checks on password-string to check required elements.

# USAGE

1. Require the module.
2. Use the init method to pass argument object.
3. Use the start method to start the process.
4. Compatible with cron-job to schedule backup-process.


# PARAMETERS
```
1.  mongodbUri       : MANDATORY | <string>    | e.g. "localhost:27017"
2.  backupDir        : MANDATORY | <string>    | e.g. "/tmp/backupDir"                    => The path to the directory, where localDB will be dumped.
3.  zipPath          : MANDATORY | <string>    | e.g. '/tmp/backup.zip'                   => The path where the backupDir is zipped to.
4.  key              : MANDATORY | <string>    | e.g. "jfdasdlkfjfdak3al2lkasdfjlk"       => aws s3 key value.
5.  secret           : MANDATORY | <string>    | e.g. "fdjaksdf_e34jk53wlksdj2092jk"      => aws s3 secret value.
6.  region           : MANDATORY | <string>    | e.g. 'us-southwest-01'                   => the region name of the s3 bucket. 
7.  bucket           : MANDATORY | <string>    | e.g. 'scheduled-backups'                 => The name of the bucket, where backup zips will be posted to.
8.  dir              : MANDATORY | <string>    | e.g. 'backupDir'                         => The directory in the bucket, where zips are stored into.
9.  name             : OPTIONAL  | <string>    | default : 'backup'                       => The alias with which we want to store our backup.zip by.
10. debugMode        : OPTIONAL  | <boolean>   | default : false                          => Enable logs from module, if false, module simply throws.
11. keepLocalBackups : OPTIONAL  | <boolean>   | default : false                          => retain or delete localBackup.
12. noOfTotalBackups : OPTIONAL  | <number>    | default : 7                              => The no. of latest n-backup to keep, older ones are automatically deleted.

```


# EXAMPLE

```
const ppSetter = require ('password-policy-setter');

// Take note of the MANDATORY and OPTIONAL parameters.
const config = {
		mongodbUri       : <string>,
		backupDir        : <string>,
		zipPath          : <string>,
		keepLocalBackups : <boolean>,
		noOfTotalBackups : <number>,
		debug            : <boolean>,

		s3         : {
			key     : <string>,
			secret  : <string>,
			region  : <string>,
			bucket  : <string>,
			name    : <string>,
			dir     : <string>,
		},
	};

// synchronous method.
module.init (config);

// asynchronous method.
module.start ();
```
