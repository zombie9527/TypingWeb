(function(){
	var printtime = "";
	var mtime = 20;
	var stime = 0;
	var timer = document.getElementById("timer");
	var time;
	// var alltime = new Data(typingtime*60);
	

	// var backtime = function(){
	function backtime(){
		if(stime!=0 || mtime!=0){
			stime--;
			if(stime<0){
				mtime--;
				stime=59;
			}
			if(mtime<10){
				printtime = "0"+mtime+":";
			}else{
				printtime = mtime+":";
			}
			if(stime<10){
				printtime += "0"+stime;
			}else{
				printtime += stime;
			}
		}else{
			clearInterval(time);
			alert("time is out");
		}
		timer.innerHTML = printtime;
	}
	time = setInterval(backtime,1000);
	
})();
