
//Time setter in jumbotron
var dateTime = null;
var date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('hh:mm a'));
};

  // Initialize Firebase
  //config information
var config = {
    apiKey: "AIzaSyCjX0A_j610_O8b93Al0Pglj7mxs-sjxT0",
    authDomain: "trainhomework-4d3be.firebaseapp.com",
    databaseURL: "https://trainhomework-4d3be.firebaseio.com",
    projectId: "trainhomework-4d3be",
    storageBucket: "trainhomework-4d3be.appspot.com",
    messagingSenderId: "1015170675104"
};


  firebase.initializeApp(config);

  //initialize variables
var database = firebase.database();
var trainName = "";
var trainDestination = "";
var trainStartTime = "";
var trainFrequency = "";
var nextArrival;
var minAway;


  $("#submitBtn").on("click", function(){
  		// Ensures no other events caused by button are run
  		event.preventDefault();

  		// Get the values from input fields
  		trainName = $("#nameSubmit").val().trim();
  		trainDestination = $("#destinationSubmit").val().trim();
  		trainStartTime = $("#timeSubmit").val().trim();
  		trainFrequency = $("#FrequencySubmit").val().trim();

  		//push to database reference
  		database.ref().push({
  			trainName: trainName,
        	trainDestination: trainDestination,
        	trainStartTime: trainStartTime,
        	trainFrequency: trainFrequency,
  		});

  });

  	// Needs to be child_added; if this is left to value error will occur;
   database.ref().on("child_added", function(snapshot) {
    //Snapshot values
    trainName = snapshot.val().trainName;
    trainDestination = snapshot.val().trainDestination;
    trainStartTime = snapshot.val().trainStartTime;
    trainFrequency = snapshot.val().trainFrequency;
    
    // create a new table row in our table
    row = $("<tr>");
    $("#firebaseContent").append(row);
    tableName = $("<td>");
    tableDestination = $("<td>");
    tableFrequency = $("<td>");
    tableNArrive = $("<td>");
    tableMAway = $("<td>");

    //Append the <td> we just made to the <tr>
    row.append(tableName);
    row.append(tableDestination);
    row.append(tableFrequency);
    row.append(tableNArrive);
    row.append(tableMAway);

    //Calculate months and train times
    var firstTimeConverted = moment(trainStartTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemaining = diffTime % trainFrequency;
    minAway = trainFrequency - timeRemaining;
    nextArrival = moment().add(minAway, "minutes");

    tableNArrive.html(moment(nextArrival).format("hh:mm a"));
    tableMAway.html(minAway);



    //This inputs the snapshot values into the table cells
    tableName.html(snapshot.val().trainName);
    tableDestination.html(snapshot.val().trainDestination);
    tableFrequency.html(snapshot.val().trainFrequency);
  } , function(error){
    console.log(error);
  });


var subtractTime = function(){
	minAway = moment(minAway).subtract(1, 'minutes');
    .html(minAway)
}

var updateMinAway = function(){
	if(minAway !== '1' || 'HERE'){
		subtractTime();
	}else if(minAway === '1'){
		$("#minAway").html('HERE');
	}else{
		$("#minAway").html(trainFrequency);
	}
}

datetime = $('#dateTime')
update();
updateMinAway();
setInterval(update, 60000);
setInterval(updateMinAway, 60000);
