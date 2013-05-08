var countdown;
var countdown_number;
var html_string = "http://search.twitter.com/search.json";
var num_tweet_display = 10;

/*var html_data = {
	q: "%23bieber",
	size: "mini",
	callback: "?"
};*/
var html_data1 = "q=%23firstworld&size=mini";
var html_data2 = "q=%23bieber&size=mini";
var setdata;
//var html_string = "https://api.twitter.com/1.1/search/tweets.json?q=%23freebandnames&since_id=24012619984051000&max_id=250126199840518145&result_type=mixed&count=4";

//
var twitterList = [];

$(document).ready(function () {
	var screen_height = screen.height;
	var tweet_height = screen.height/num_tweet_display;
	var layout = []
	
	for(var i=0;i < num_tweet_display;i++){
		layout.push('<li id="' + i + '">'+
						'<img id = "profile_image"></img>' + 
						'<div id = "user"></div>'+
						'<div id = "content"></div>'+
						'<div id = "timestamp"></div>'+
					'</li>');
	}
	$('<ul/>', {
			'class': 'tweet_list',
			html:layout
	}).appendTo('body');
	
	
	setdata = html_data1;
	get_tweets();
	refresh_trigger();
	
	/*
    $("button").click(function(){
		countdown_number = 11;
		countdown_trigger();
	}); 
	*/
	
});

function get_tweets(){
	if(setdata === html_data1){
		setdata = html_data2;
	} else {
		setdata = html_data1;
	}
	
	$.ajax({
		'type':    'GET',
		'url':     html_string,
		'dataType':	'jsonp',
		'contentType':	"application/json; charset=utf-8",
		'data'	:	setdata,
		'async':   true,
		'cache':   false,
		'global':  false,
		'jsonpCallback':	"display_tweets"
	});
}

function refresh_trigger() {
	$("#output_text").html(countdown);
	countdown = setTimeout('refresh_trigger()', 10000);
	get_tweets();
}

function countdown_trigger() {
	countdown_number--;
	$("#output_text").html(countdown_number);
	if(countdown_number > 0) {
		countdown = setTimeout('countdown_trigger()', 1000);
	}
}

function display_tweets(data) {
	//test = data["results"];
//created_at
//from_user
//from_user_name
//profile_image_url
//text
	/*
	$.each(data.results, function(key, val) {
		items.push('<li id="' + key + '">' + val.text + ' SEPERATE HERE '+ val + '</li>');
	});
		
	$('<ul/>', {
		'class': 'my-new-list',
		html: items.join('')
	}).appendTo('body');
	*/
	
	var tweetObj = new Object();
	for(var i=0;i < num_tweet_display;i++){
		tweetObj.user = data.results[i].from_user;
		tweetObj.content = data.results[i].text;
		tweetObj.timestamp = data.results[i].created_at;
		tweetObj.image_url = data.results[i].image_url;
		
		twitterList[i] = tweetObj;
		
		//$('#'+i).html(tweetObj.content);
		//setup_tweet(i,tweetObj);
		$('#'+i+' > #user' ).html(tweetObj.user);
		$('#'+i+' > #content' ).html(tweetObj.content);
		$('#'+i+' > #timestamp' ).html(tweetObj.timestamp);
		$('#'+i+' > #profile_image' ).attr("src",tweetObj.image_url);
		/*if(twitterList[i] == null){
			tweetObj.user = data.results[i].from_user;
			tweetObj.content = data.results[i].text;
			tweetObj.timestamp = data.results[i].created_at;
			tweetObj.image_url = data.results[i].image_url;
			
			twitterList.push(tweetObj);
			setup_tweet(i,tweetObj);
		} else {
			if(twitterList[i].timestamp < data.results[i].created_at){
				tweetObj.user = data.results[i].from_user;
				tweetObj.content = data.results[i].text;
				tweetObj.timestamp = data.results[i].created_at;
				tweetObj.image_url = data.results[i].image_url;
				
				twitterList[i] = tweetObj;
				//$('#'+i).html(tweetObj.content);
				setup_tweet(i,tweetObj);
			}
		}*/
	}
	
	/*
	$.each(twitterList, function(key, val){
		//alert(val.content);
		$('#'+i).html(val.content);
	});
	*/
}

function setup_tweet(index, tweetObj){
	$('#'+index+' > #user' ).html(tweetObj.user);
	$('#'+index+' > #content' ).html(tweetObj.content);
	$('#'+index+' > #timestamp' ).html(tweetObj.timestamp);
	$('#'+index+' > #profile_image' ).attr("src",tweetObj.image_url);
}