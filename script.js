var countdown;
var countdown_number;
var html_string = "http://search.twitter.com/search.json";
var num_tweet_display = 10;

var html_data1 = "q=%23bieber&size=mini";
var html_data2 = "q=%23firstworld&size=mini";
var setdata;

var twitterList = [];

$(document).bind('pageinit',function () {
	var screen_height = screen.height;
	var tweet_height = screen.height/num_tweet_display;
	var layout = [];
	
	for(var i=0;i < num_tweet_display;i++){		
		layout.push('<li id="' + i + '" class="ui-li ui-li-static ui-btn-up-c ui-li-has-thumb">'+
						'<img id = "profile_image" data-role="content" class="ui-li-thumb"></img>'+
						'<div id ="content" data-role class="ui-li-heading"></div>'+
						'<div id="user" class="ui-li-desc"></div>'+
						'<div id="timestamp" class="ui-li-desc"></div>'+
					'</li>'
		);
		
		$('#tweet_list').append(layout[i]);
	}
	
	setdata = html_data1;
	get_tweets();
	var timer = setInterval(get_tweets,1000);
	$('#result').bind('page_init', function() {
		$('#tweet_list').listview('refresh');
	});
	
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
		'cache':   true,
		'global':  false,
		'jsonpCallback':	"display_tweets"
	});
}

function display_tweets(data) {
//test = data["results"];
//created_at
//from_user
//from_user_name
//profile_image_url
//text
	
	var tweetObj = new Object();
	for(var i=0;i < num_tweet_display;i++){
		tweetObj = new Object();

		tweetObj.user = data.results[i].from_user;
		tweetObj.content = data.results[i].text;
		tweetObj.timestamp = new Date(Date.parse(data.results[i].created_at));
		tweetObj.image_url = data.results[i].profile_image_url;
		
		twitterList[i] = tweetObj;
		setup_tweet(i,tweetObj);
	}
	

	
	/*
	var tweetObj = new Object();
	for(var i=0;i < num_tweet_display;i++){
		tweetObj = new Object();
		if(twitterList[i] == null){
			tweetObj.user = data.results[i].from_user;
			tweetObj.content = data.results[i].text;
			tweetObj.timestamp = new Date(Date.parse(data.results[i].created_at));
			tweetObj.image_url = data.results[i].profile_image_url;
			
			twitterList[i] = tweetObj;
			setup_tweet(i,tweetObj);
		} else {
			if(twitterList[i].timestamp.getTime() < new Date(data.results[i].created_at).getTime()){
				tweetObj.user = data.results[i].from_user;
				tweetObj.content = data.results[i].text;
				tweetObj.timestamp = new Date(Date.parse(data.results[i].created_at));
				tweetObj.image_url = data.results[i].profile_image_url;
				
				twitterList[i] = tweetObj;
				setup_tweet(i,tweetObj);
			}
		}
	}
	*/
}

function setup_tweet(index, tweetObj){
	//$('li[id='+index+'][id=user]').html(tweetObj.user);
	
	$('#'+index+'> #user' ).html(tweetObj.user);
	$('#'+index+'> #content' ).html(tweetObj.content);
	$('#'+index+'> #timestamp' ).html(tweetObj.timestamp.toDateString()+" "+tweetObj.timestamp.toLocaleTimeString());
	//load_profile_image(index,tweetObj.image_url)
	
	$('#'+index+'> #profile_image' ).hide();
	$('#'+index+'> #profile_image_preload' ).show();	
	$('#'+index+'> #profile_image').attr('src', tweetObj.image_url).load(function(){
		if(this.complete){
			$('#'+index+'> #profile_image' ).show();
			$('#'+index+'> #profile_image_preload' ).hide();
		}
	});
	
	
	$('#tweet_list').listview('refresh');
}
