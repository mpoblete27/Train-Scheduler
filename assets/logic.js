  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDt26IJM4QnpICU967-7OXtYI1KIvRCYT8",
    authDomain: "train-scheduler-291e3.firebaseapp.com",
    databaseURL: "https://train-scheduler-291e3.firebaseio.com",
    projectId: "train-scheduler-291e3",
    storageBucket: "train-scheduler-291e3.appspot.com",
    messagingSenderId: "573879846083"
  };
  firebase.initializeApp(config);

  //create database variable
var database = firebase.database();
var minutesUntilTrain = 0;

//Function to run when you submit form data:
$("#submit-button").on("click", function (){
    //prevent refresh
    event.preventDefault();

    //make form inputs into variables:
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    //make sure everything is filled out
  if(trainName === "" || destination === "" || firstTrainTime === "" || frequency === ""){
    return false;
    alert("Please enter correct input in the form");
  }
  //ensure military time in the frequency entry
  else if(isNaN(frequency)){
    $("inputFrequency").empty();
    alert("Please enter a number for Frequency");
  }
  else{
    //use momentjs to convert times to correct format
    var timeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

    var currentTime = moment();

    var timeDiff = moment().diff(moment(timeConverted), "minutes");

    var remainingTime = timeDiff % frequency;

    var minutesUntilTrain = frequency - remainingTime;

    var nextTrain = moment().add(minutesUntilTrain).format("hh:mm A");

  var newestTrain = {
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    firstTrainTime: firstTrainTime,
    nextTrain: nextTrain,
    minutesUntilTrain: minutesUntilTrain,
    currentTime: currentTime.format("hh:mm A"),
  };
database.ref().push(newestTrain);

$("#trainName").val("");
$("#destination").val("");
$("#frequency").val("");
$("#firstTrainTime").val("");
  } 
});

//snapshot stopred data to get values in real time
database.ref().on("childAdded", function(childSnapshot, prevChildKey){
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;
  var nextTrain = childSnapshot.val().nextTrain;
  var minutesUntilTrain = childSnapshot.val().minutesUntilTrain;
  var currentTime = childSnapshot.val().currentTime;

var timeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "year");

var currentTime = moment();

var timeDiff = moment().diff(moment(timeConverted, "minutes"));

var remainingTime = timeDiff % frequency;

var minutesUntilTrain = frequency - remainingTime;

var nextTrain = moment().add(minutesUntilTrain, "minutes").format("hh:mm A");


// update the schedule table and append
var tRow = $("<tr>");
var trainTd = $("<td>").text(trainName);
var destinationTd = $("<td>").text(destination);
var nextTrainTd = $("<td>").text(nextTrain);
var frequencyTd = $("<td>").text(frequency);
var minutesUntilTrain = $("<td>").text(minutesUntilTrain);

$(".newTrain").append(tRow);
});