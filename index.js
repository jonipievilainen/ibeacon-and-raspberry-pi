var Bleacon = require('bleacon');
var cron = require('node-cron');

var configurations = require('./configurations.json');

var uuid		=	configurations.uuid;
var major		=	configurations.major; 
var minor		=	configurations.minor;
var timeOfExit	=	60; //300

var beacons = {};
 
Bleacon.startScanning(uuid, major, minor);
// Bleacon.startScanning();

Bleacon.on('discover', function(bleacon) {
    console.log('----------------------------------'); 
    console.log(new Date()); 
    console.log(bleacon); 
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
}

function deviceJoinToRange(uuid){
	console.log("device join to range!!!!!!!!!!!!!!!!!!!!!");
}
