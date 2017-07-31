$(".jumbotron h1").flapper({width:15}).val("Train Scheduler").change();
$(".jumbotron h2").flapper({width:20}).val("The Current Time is:").change();

//Time setter in jumbotron
var dateTime = null;
var date = null;

var update = function () {
    datetime.empty();
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
        	trainFrequency: trainFrequency
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
    tableName.addClass("flapper xs");
    tableDestination = $("<td>");
    tableDestination.addClass("flapper xs");
    tableSTime = $("<td>");
    tableSTime.addClass("flapper xs");
    tableSTime.addClass("startTime")
    tableSTime.attr("data-val" , snapshot.val().trainStartTime)
    tableFrequency = $("<td>");
    tableFrequency.addClass("frequency");
    tableFrequency.addClass("flapper xs");
    tableFrequency.attr("data-val" , snapshot.val().trainFrequency);
    tableNArrive = $("<td>");
    tableNArrive.addClass("nextArrival")
    tableNArrive.addClass("flapper xs");
    tableMAway = $("<td>");
    tableMAway.addClass("minAway");
    tableMAway.addClass("flapper xs");

    //Append the <td> we just made to the <tr>
    row.append(tableName);
    row.append(tableDestination);
    row.append(tableSTime);
    row.append(tableFrequency);
    row.append(tableNArrive);
    row.append(tableMAway);

    //Calculate train times
    var firstTimeConverted = moment(trainStartTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemaining = diffTime % trainFrequency;
    var minAway = trainFrequency - timeRemaining;
    var nextArrival = moment().add(minAway, "minutes");
    tableNArrive.html(moment(nextArrival).format("hh:mm a"));
    tableMAway.html(minAway);

    //This inputs the snapshot values into the table cells
    tableName.flapper({width: snapshot.val().trainName.length}).val(snapshot.val().trainName).change();
    tableDestination.flapper({width: snapshot.val().trainDestination.length}).val(snapshot.val().trainDestination).change();
    tableSTime.flapper({width: 5}).val(snapshot.val().trainStartTime).change();
    tableFrequency.flapper({width: snapshot.val().trainFrequency.length}).val(snapshot.val().trainFrequency).change();
  } , function(error){
    console.log(error);
  });


//NEED TO FIX UPDATE ISSUE WITH HERE
var updateMinAway = function(){
	$(".minAway").each(function(){
    var frequency = parseInt($(this).closest('tr').children('.frequency').attr("data-val"));
    var firstTimeConverted = moment($(this).closest('tr').children('.startTime').attr("data-val"), "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemaining = diffTime % frequency;
    var minAway = frequency - timeRemaining;
		if($(this).html().trim() === "HERE" && timeRemaining !== 0){
      $(this).html($(this).closest('tr').children('.frequency').attr("data-val"));
      var newArrival = moment().add(frequency , "minutes").subtract(1 , 'minutes').format("hh:mm a");
      $(this).closest('tr').children('.nextArrival').html(newArrival);
      $(this).html(minAway);
		}else if(timeRemaining === 0){
      $(this).html('HERE');
    }else{
      $(this).html(minAway);
     }
	});
};

datetime = $('#dateTime');
update();
updateMinAway();
setInterval(update, 1000);  //60000
setInterval(updateMinAway, 1000);