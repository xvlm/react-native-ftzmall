$(document).ready(function() {
	var agent = navigator.userAgent.toLowerCase();
	if (agent.indexOf("ftzmall_app") >= 0) {
		$("header").remove();
		$("footer").remove();
		$("section").children().first().css("margin-top", "0px");
		$("body").append("<input id='channelType' type='hidden' value='1'>");
	}
	if(agent.indexOf("android") >= 0){
		$("body").append("<input id='channelId' type='hidden' value='android'>");
	}else if(agent.indexOf("mac os x") >= 0 && agent.indexOf("mobile") >= 0){
		$("body").append("<input id='channelId' type='hidden' value='ios'>");
	}
});