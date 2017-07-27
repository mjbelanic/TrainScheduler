//TO COMPLETE update set a timer to 1 min (1000);
// At zero  make it HERE;
// if HERE reset;

	var Timer = {
		  clockRunning: false,
	  	  intervalId: null,
		  time: null,

		  reset: function(givenTime) {
		    // DONE: Change the "display" div to "00:00."
		    this.time = givenTime;
		    $("#timer").html(this.time);
		  },

		  start: function(givenTime) {
		  	this.time = givenTime;
		    // DONE: Use setInterval to start the count here and set the clock to running.
		    if (!this.clockRunning) {
		        this.intervalId = setInterval(Timer.decrement, 1000);
		        this.clockRunning = true;
		    }
		  },

		  decrement: function() {
		    // DONE: increment time by 1, remember we cant use "this" here.
		    if(Timer.time > 0){
			    Timer.time--;
			    var converted = Timer.timeConverter(Timer.time);
			    $("#timer").html(converted);
			}else{
				TriviaGame.RevealAns(null);
				Timer.start(60);
				setTimeout(function(){
			}
		  }
	}