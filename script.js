var countdown;
var countdown_number;
var html_string = "http://search.twitter.com/search.json";
var num_tweet_display = 10;
var num_tweet_store;
var check_interval = 3000;

var html_data1 = "q=%23bieber&size=mini";
var html_data2 = "q=%23firstworld&size=mini";
var setdata;

var twitterList = [];
var downloadedImage = [];

var since_id;
var max_id;
var count;

var debug;

$(document).bind('pageinit',function () {
	var screen_height = screen.height;
	var tweet_height = screen.height/num_tweet_display;
	var layout = [];
	
	//'<img id = "profile_image_preload" data-role="content" width=80 height=80 src=preload.png class="ui-li-thumb"></img>'+
	
	for(var i=0;i < num_tweet_display;i++){		
		layout.push('<li id="' + i + '" class="ui-li ui-li-static ui-btn-up-c ui-li-has-thumb">'+
						'<img id = "profile_image" data-role="content" width=80 height=80 class="ui-li-thumb"></img>'+
						'<div id ="content" data-role class="ui-li-content"></div>'+
						'<div id="user" class="ui-li-desc"></div>'+
						'<div id="timestamp" class="ui-li-desc"></div>'+
					'</li>'
		);
		
		$('#tweet_list').append(layout[i]);
		
		$('#'+i+'> #profile_image' ).hide();
	}
	
	/*
	for(var i=0;i < num_tweet_display;i++){
		//$('#'+i+'> #profile_image_preload' ).show();
		$('#'+i+'> #profile_image' ).hide();
	}
	*/
	
	num_tweet_store = num_tweet_display+5;
	count = 2;
	setdata = html_data1+"&count="+count;
	get_tweets_init();
	//var timer = setInterval(get_tweets_latest,check_interval);
	$('#result').bind('page_init', function() {
		$('#tweet_list').listview('refresh');
	});
	
	
	$(window).scroll(function(){
		 if($(window).scrollTop() == $(document).height() - $(window).height()){
			alert("bottom");
			get_tweets_older();
		 }
	});
	
});

function get_tweets_init(){
	$.ajax({
		'type':    'GET',
		'url':     html_string,
		'dataType':	'jsonp',
		'contentType':	"application/json; charset=utf-8",
		'data'	:	setdata,
		'async':   true,
		'cache':   true,
		'global':  false,
		'jsonpCallback':	"store_tweets_init"
	});
}

function get_tweets_latest(){
	var latestdata = setdata+"&since_id="+since_id;
	$.ajax({
		'type':    'GET',
		'url':     html_string,
		'dataType':	'jsonp',
		'contentType':	"application/json; charset=utf-8",
		'data'	:	latestdata,
		'async':   true,
		'cache':   true,
		'global':  false,
		'jsonpCallback':	"store_tweets_latest"
	});
}

function get_tweets_older(){
	var olderdata = setdata+"&max_id="+max_id;
	$.ajax({
		'type':    'GET',
		'url':     html_string,
		'dataType':	'jsonp',
		'contentType':	"application/json; charset=utf-8",
		'data'	:	olderdata,
		'async':   true,
		'cache':   true,
		'global':  false,
		'jsonpCallback':	"store_tweets_older"
	});
}

function store_tweets_init(data){
	var tweetObj = new Object();
	var latestTweets = [];
	for(var i=0;i < count;i++){
		twitterList[i] = setTwitterObj(data.results[i]);
	}
	
	//max_id = data.max_id;
	max_id = twitterList[twitterList.length-1].id
	since_id = twitterList[0].id;
}

function store_tweets_latest(data){
	var latestsTweets = [];
	if(twitterList == null){
		return;
	}
	for(var i=count-1;i >= 0;i--){
		tweetObj = setTwitterObj(data.results[i]);;
		twitterList.unshift(tweetObj);
	}
	
	since_id = twitterList[0].id;
}

function store_tweets_older(data){
	var olderTweets = [];
	if(twitterList == null){
		return;
	}
	debug = data;
	for(var i=0;i < count;i++){
		tweetObj = setTwitterObj(data.results[i]);
		twitterList.push(tweetObj);
	}
	
	//max_id = data.max_id;
	max_id = twitterList[twitterList.length-1].id;
}

function setTwitterObj(dataEntry){
	var tweetObj = new Object();
	tweetObj.user = dataEntry.from_user;
	tweetObj.content = dataEntry.text;
	tweetObj.timestamp = new Date(Date.parse(dataEntry.created_at));
	tweetObj.image_url = dataEntry.profile_image_url;
	tweetObj.id = dataEntry.id;
	
	return tweetObj;
}

function display_tweets(data) {
//test = data["results"];
//created_at
//from_user
//from_user_name
//profile_image_url
//text

	/*
	var tweetObj = new Object();
	for(var i=0;i < num_tweet_display;i++){
		tweetObj = new Object();

		tweetObj.user = data.results[i].from_user;
		tweetObj.content = data.results[i].text;
		tweetObj.timestamp = new Date(Date.parse(data.results[i].created_at));
		tweetObj.image_url = data.results[i].profile_image_url;
		
		twitterList[i] = tweetObj;
		display_tweet(i,tweetObj);
	}
	*/

	var tweetObj = new Object();
	for(var i=0;i < num_tweet_display;i++){
		tweetObj = new Object();
		if(twitterList[i] == null){
			tweetObj.user = data.results[i].from_user;
			tweetObj.content = data.results[i].text;
			tweetObj.timestamp = new Date(Date.parse(data.results[i].created_at));
			tweetObj.image_url = data.results[i].profile_image_url;
			
			twitterList[i] = tweetObj;
			display_tweet(i,tweetObj);
		} else {
			if(twitterList[i].timestamp.getTime() < new Date(data.results[i].created_at).getTime()){
				tweetObj.user = data.results[i].from_user;
				tweetObj.content = data.results[i].text;
				tweetObj.timestamp = new Date(Date.parse(data.results[i].created_at));
				tweetObj.image_url = data.results[i].profile_image_url;
				
				twitterList[i] = tweetObj;
				display_tweet(i,tweetObj);
			}
		}
	}
}

function display_tweet(index, listIndex, tweetObj){
	//$('li[id='+index+'][id=user]').html(tweetObj.user);
	
	$('#'+index+'> #user' ).html(tweetObj.user);
	$('#'+index+'> #content' ).html(tweetObj.content);
	$('#'+index+'> #timestamp' ).html(tweetObj.timestamp.toDateString()+" "+tweetObj.timestamp.toLocaleTimeString());
	//load_profile_image(index,tweetObj.image_url)
	
	$('#'+index+'> #profile_image' ).hide();
	//$('#'+index+'> #profile_image_preload' ).show();
	
	$('#tweet_list').listview('refresh');
	
	
	$('#'+index+'> #profile_image').attr('src', tweetObj.image_url).load(function(){
		if(this.complete){
			$('#'+index+'> #profile_image' ).show();
			//$('#'+index+'> #profile_image_preload' ).hide();
		}
	});
	
	$('#tweet_list').listview('refresh');
}
