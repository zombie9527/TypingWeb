window.onload = function() {
	var totalTime = 20;
	var text = ";uabcdefg hijklmn opqrst uvwxyz abcdefg hijklmn opqrst uvwxyz ";
	var fingerKeys = [" ","tgbrfv","edc","wsx","qaz", " ","byhnujm", "ik,","ol.","p;?\""];	
	var currCharIndex = 0,textIndex = 0;
	/*time*/
	var printtime = "";
	var mtime = 0,stime = 0;
	var intervaltime;
	var accuracy = 0;
	var json;
	
	var loadText = function( text,container, lineWidth) {
		container.innerHTML = "";
		changeClass();
		var p = null;
		mtime = totalTime;
		stime = 0;
		currCharIndex = 0;
		clearInterval(intervaltime);
		begintyping();
		for (var i = 0; i < text.length; i++) {
		
			if (i % lineWidth == 0) {
				p = document.createElement("p");
				container.appendChild(p);
			}
			
			var span = document.createElement("span");
			span.innerHTML = text[i]==" "? "&nbsp;" : text[i];
			
			p.appendChild(span);
		}
		updateView();
	};
	
	var selectChar = function(currCharIndex, error) {
	
		var charSpans = Util.T$("span",Util.$("text"));
		
		for (var i = currCharIndex > 0 ? currCharIndex - 1: currCharIndex; 
			i <= currCharIndex + 1 && i < text.length; i++){
				if (charSpans[i].className == "current")
				{
					charSpans[i].className = "";
				}
			}
		
		if (error)
		{
			if(error === 1)
				charSpans[currCharIndex].className = "correct";
			else
				charSpans[currCharIndex].className = "error";
		}
		else
		{
			charSpans[currCharIndex].className = "current";
		}
	};
	
	var selectKey = function(currCharIndex) {
		var keys = Util.C$("key",Util.$("keyboard"));
		
		for (var i = 0; i < keys.length; i++)
		{	if (keys[i].className.indexOf("current") != -1)
			{
				keys[i].className = keys[i].className.replace(" current", "");
			}
			
			var currChar = text[currCharIndex].toUpperCase();
			var keyChar = keys[i].innerHTML;
			
			if (keyChar == currChar || keyChar[0] == currChar || keyChar[5] == currChar)
			{
					keys[i].className += " current";
			}
		}
	};

	var selectFinger = function(currCharIndex) {
		var currChar = text[currCharIndex];
		
		var leftHand = Util.$("left-hand");
		var rightHand = Util.$("right-hand");
		
		leftHand.className = "";
		rightHand.className = "";
		
		for (var i = 0; i <fingerKeys.length; i++)
		{
			if (fingerKeys[i].indexOf(currChar) != -1)
			{	
				var hand = leftHand;
				if (Math.floor(i / 5) == 1 )
				{
					hand = rightHand;
				}
				hand.className="finger-" + (i % 5 + 1);
			}
		}
		
	};
	
	var updateView = function()
	{
		selectChar(currCharIndex);
		selectKey(currCharIndex);
		selectFinger(currCharIndex);
	};

	var backtime = function(){
		if(stime!=0 || mtime!=0){
			stime--;
			if(stime<0){
				mtime--;
				stime=59;
			}
			printtime = judge(mtime) + ":" +judge(stime);
		}else{
			stoptyping();
			alert("时间到,未完成");
			return false;
		}
		var number = 0;
		number = Util.C$("correct",Util.$("text")).length/(currCharIndex||1);
		accuracy  = Math.round(number*100);
		var speed = Math.round((currCharIndex/(totalTime*60-mtime*60-stime))*60);
		changeView(printtime,speed,accuracy);
	};
	
	var judge = function(num){
		if(num<10){
			return '0'+num;
		}else{
			return num;
		}
	}
	
	var changeView = function(printtime,speed,accuracy){
		Util.$("accurate-rate").innerHTML = accuracy + "%";
		Util.$("kpm").innerHTML = speed;
		Util.$("timer").innerHTML = printtime;
	}
	
	var deal = function(responseText){
		var content = "";
		json = JSON.parse(responseText);			//jiexi
		for(var i = 0;i<json.course.length;i++){
			content += "<option>"+json.course[i].name+"</option>";
		}
		Util.$("level").innerHTML = content;		//
		text = json.course[0].text;
		loadText(text,Util.$("text"), 49);
		var options = Util.T$("option",Util.$("level"));
		for(var j = 0;j<options.length;j++){
			(function(j){
				options[j].onclick=function(){
					text = json.course[j].text;
					textIndex = j;
					loadText(text,Util.$("text"), 49);
				}
			})(j);
		}
	};
	var changeClass = function(){
		text = json.course[textIndex].text;
		totalTime = json.course[textIndex].time;
	}
	
	var inputext = function(event){
		var keyCode = event.keyCode || event.which || event.charCode;
		var keyChar = String.fromCharCode(keyCode);
		if(!(112<=keyCode && keyCode<=123))
			event.preventDefault();
		if (text[currCharIndex] != keyChar)
		{
			selectChar(currCharIndex, true);
		}
		else
		{
			selectChar(currCharIndex,1);
		}
		if (currCharIndex < text.length - 1)
		{
			currCharIndex++;
		}
		updateView();
		if(currCharIndex==text.length-1){
			stoptyping();
			var options = Util.T$("option",Util.$("level"));
			if(accuracy>=95){
				if(textIndex < options.length-1){
					options[textIndex+1].disabled = false;
					options[textIndex+1].className="";
				}
				alert("此关已完成\n共用时:" + (totalTime*60-mtime*60-stime)+"秒" );
			}else{
				if(confirm("   此关未完成\n正确率低于95%\n  确定重新开始")){
					loadText(Util.$("text"), 49);
				}
			}
		}
	};
	var begintyping = function(){
		changeView("回车开始",0,0);
		document.addEventListener("keyup",enterbegin ,false);
	};
	var enterbegin = function(event){
		var keyCode = event.keyCode || event.which || event.charCode;
		switch(keyCode)
		{
			case 13:intervaltime = setInterval(backtime,1000);
					document.addEventListener("keypress",inputext,false);
					document.addEventListener("keydown",backSpace,false);//enter
					var str = judge(totalTime) + ":00"
					changeView(str,0,0);
					document.removeEventListener("keyup",enterbegin);break;
			default:break;
		}
	};
	var stoptyping = function(){
			clearInterval(intervaltime);
			document.removeEventListener("keypress",inputext,false);
			document.removeEventListener("keydown",backSpace,false);
	};
	var backSpace = function(event){
		var keyCode = event.keyCode || event.which || event.charCode;
		switch(keyCode)
		{
			case 8: //backspace
				if (currCharIndex > 0)
				{
					currCharIndex--;
				}
				break;
			default:
		}
		updateView();
	};
	
	Util.ajaxGet("course.json",deal,function(){alert("failed")});
};