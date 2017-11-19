var Bleacon = require('bleacon');
var cron = require('node-cron');

var configurations = require('./configurations.json');

var uuid		=	configurations.uuid;
var major		=	configurations.major; 
var minor		=	configurations.minor;
var timeOfExit	=	300; //300

var beacons = {};
const exec = require('child_process').exec;
 
Bleacon.startScanning(uuid, major, minor);
// Bleacon.startScanning();

Bleacon.on('discover', function(bleacon) {
    console.log('----------------------------------'); 
    console.log(new Date()); 
    console.log(bleacon);
	
	if (!(bleacon.uuid in beacons)){
		deviceJoinToRange(bleacon.uuid);
	}
	
	beacons[bleacon.uuid] = {"date": new Date()};
});

cron.schedule('* * * * *', function(){
  console.log('=================================');
  console.log(beacons);
	for(var device in beacons){
		var currentTime = new Date();
		var difference = (currentTime.getTime() - beacons[device]["date"].getTime()) / 1000; //sec
		if(difference > timeOfExit){
			deviceExitFromRange(device)
			delete beacons[device]; 
		}
	}
});


function deviceExitFromRange(uuid){
	console.log("device has been exit!!!!!!!!!!!!!!!!!!!!!");
	exec('sh ./leave.sh', function(err,stdout,stderr){
		console.log(err,stdout,stderr);
	})
}

function deviceJoinToRange(uuid){
	console.log("device join to range!!!!!!!!!!!!!!!!!!!!!");
	
	exec('sh ./join.sh', function(err,stdout,stderr){
		console.log(err,stdout,stderr);
	})
}