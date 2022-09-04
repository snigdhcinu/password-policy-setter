const fs         = require ('fs');
const aws        = require ('aws-sdk');
const log        = require ('./store/log');
const exec       = require ('child_process').exec;
const util       = require ('util');
const moment     = require ('moment');
const archiver   = require ('archiver');

/*
 * Make db backup on disk.
 * Upload backup to s3.
 * Delete backup from disk.
 * Delete cloud backups older than latest n-saved.
 */

const makeDbBackup = async (metaInfo) => {
	const config = {
		...metaInfo,
	};

	try {

		aws.config.update ({
			accessKeyId     : config.s3.key,
			secretAccessKey : config.s3.secret,
			region          : config.s3.region,
		});

		const s3 = new aws.S3 ();

		await makeLocalBackup (config);
		await zipDirectory (config);
		await deleteLocalBackup ('dir', config);
		await uploadLocalBackup (config, s3);
		await deleteLocalBackup ('zip', config);
		await deleteCloudBackups (config, s3);
	}
	catch (err) {
		log.error ({err}, "error in make-and-upload backup process");
		await deleteLocalBackup (null, config);
	}
};

const makeLocalBackup = async (config) => {
	const cmd = `mongodump --out=${config.backupDir} --uri=${config.mongodbUri}`;

	try {
		await executeCmd (cmd);
	}
	catch (err) {
		throw ({err, customMsg: 'Error executing command', cmd});
	}
};

const zipDirectory = async (config) => {
	// refer to this link : https://www.npmjs.com/package/archiver.

	const archive = archiver ('zip', { zlib: { level: 9 }});
	const stream  = fs.createWriteStream(config.zipPath);

	return new Promise ( (resolve, reject) => {
		archive
			.directory (config.backupDir, false)
			.on ('error', err => reject (err))
			.pipe (stream);

		stream.on ('close', () => resolve ());
		archive.finalize ();
	});
};

const executeCmd = (cmd) => {
	return new Promise ((resolve, reject) => {
		exec (cmd, (error, stdout, stderr) => {
			if (error)
				return reject (error);

			resolve ();
		});
	});
};

const uploadLocalBackup = async (config, s3) => {
	const root         = config.s3.dir;
	const fileName     = config.s3.name;
	const readFile     = util.promisify (fs.readFile);

	try {
		const content    = await readFile (config.zipPath);
		const ts         = moment ().utc ().format ();

		const params     = {
			Bucket : config.s3.bucket,
			Key    : `${root}/${ts}_${fileName}.zip`,
			Body   : content,
			ACL    : 'private', // list here : https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html
		};
		await uploadBackup (params, s3);
		log.info ('backup upload ok');

	}
	catch (error) {
		throw ({error, customMsg : 'error in read-and-upload backup process', s3, config});
	}
};

const uploadBackup = (params, s3) => {
	return new Promise ( (resolve, reject) => {
		s3.putObject(params, function (err, result) {
			if (err) {
				log.error ({err : err}, 'backup upload error');
				return reject (err);
			}

			resolve (result);
		});
	});
};

const deleteLocalBackup = async (mode, config) => {
	// TODO : keep zip only.

	if (config.keepLocalBackups) {
		log.info ("Retaining local backups.");
		log.warn ("NOTE : No auto delete of local backups, need to do it manually.");

		return;
	}

	const rm    = util.promisify (fs.rm);
	const rmdir = util.promisify (fs.rmdir);

	try {
		switch (mode) {
			case 'dir':
				await rmdir (config.backupDir, {
					maxRetries : 1,
					recursive  : true,
					retryDelay : 100,
				});
				log.info ("backup directory delete ok");
				break;

			case 'zip':
				await rm (config.zipPath);
				log.info ("backup zip delete ok");
				break;

			default:
				await rmdir (config.backupDir, {
					maxRetries : 1,
					recursive  : true,
					retryDelay : 100,
				});
				await rm (config.zipPath);
				log.info ("backup directory and zip delete ok");
		}

	}
	catch (err) {
		throw ({err, customMsg : "error deleting local backup"});
	}
};

const deleteCloudBackups = async (config, s3) => {
	const params = {
		Bucket : config.s3.bucket,
		Prefix : `${config.s3.dir}`,
	};

	try {
		let objects = await listObjects (params, s3);
		if (objects.Contents.length > config.noOfTotalBackups)
			await deleteObjects (config, s3, objects.Contents);
	}
	catch (err) {
		throw ({err, customMsg : "error deleting exceeding cloud backups", params, s3, config});
	}
};

// list objects stored in s3 bucket.
const listObjects = (params, s3) => {
	return new Promise ( (resolve, reject) => {
		s3.listObjects (params, (err, data) => {
			if (err) {
				log.error ({err}, "error listing objects in bucket");
				return reject (err);
			}

			resolve (data);
		});
	});
};

const deleteObjects = (config, s3, contents) => {
	return new Promise ( (resolve, reject) => {
		// Since each new backup is pushed into the contents array, thus object at index 0 will be the oldest, and the one at index contents.length - 1 will be the latest.
		const outdatedContents = contents.slice (0, (contents.length - config.noOfTotalBackups));

		outdatedContents.forEach ((outdatedContent) => {
			const params = {
				Bucket : config.s3.bucket,
				Key    : outdatedContent.Key,
			};

			s3.deleteObject (params, (err, data) => {
				if (err) {
					log.error ({err}, "error deleting objects in bucket");
					return reject (err);
				}

				log.info ({params}, 'delete ancient object ok');
			});
		});
		resolve ();
	});
};

module.exports = makeDbBackup;
