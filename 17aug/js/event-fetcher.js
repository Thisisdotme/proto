var TIM = {};
TIM.models = {};
TIM.collections = {};
TIM.views = {};
TIM.apiUrl = "http://api3.thisis.me/v1/";
TIM.pageInfo = {
  authorName: ""
}
TIM.eventCollection = undefined;
TIM.usePreloadedEvents = false;

var authorsWithCovers = "mchammer phil loree philblack".split(' '), author, authorClass;

var authorDisplayNames = {
  "phil" : "Phil",
  "mchammer" : "Hammer"
}

var authorsWithHeadlines = "mchammer phil".split(' ');

var authorHeadlines = {
  "phil" : {
    "full_name" : "Phil Goffin",
    "tagline" : "Internet Entrepreneur, Disruptive Investor, Husband &amp; Father",
    "topstories" :  [
                      {
                        "headline" : "Trip to Barcelona",
                        "tagline" : "added 3 hours ago"
                      },
                      {
                        "headline" : "thisis.me launch party photos",
                        "tagline" : "added last month"
                      }
                    ]
  },
  "mchammer" : {
    "full_name" : "MC Hammer",
    "tagline" : "Rapper, Internet Entrepreneur, Spokesman & Actor"
  },
    "loree" : {
    "full_name" : "Loree Hirschman",
    "tagline" : "Former Navy Jet Pilot, Entrepreneur & Author"
  },
    "philblack" : {
    "full_name" : "Phil Black",
    "tagline" : "Entrepreneur & Technology Investor",
    "topstories" :  [
                      {
                        "headline" : "True Ventures Invests in Quality",
                        "tagline" : "especially thisis.me"
                      },
                      {
                        "headline" : "@brianwong, Good Point!",
                        "tagline" : "Kiip is doing well!"
                      }
                    ]
  }
}

function generateHeadline(authorname) {
  
  authorname = authorname || "phil";
  
  for (var i = 0; i < authorsWithHeadlines.length; i++) {
    if(authorsWithHeadlines[i] === authorname) {
      return;
    }
  }
  
  var headlineObj = authorHeadlines[authorname];
  if (!headlineObj) {
    headlineObj = {
      full_name: authorname,
      tagline: "Internet Entrepreneur, Person",
      "topstories" :  [
                        {
                          "headline" : "Headline 1",
                          "tagline" : "4 hours ago"
                        },
                        {
                          "headline" : "Headline 2",
                          "tagline" : "8 hours ago"
                        }
                      ]
    }
  }
  var html = '';
  
   html += '<h1 id="author-name">' + headlineObj.full_name + '</h1>'
          + '<h2 id="author-tagline">' + headlineObj.tagline + '</h2>';
  
  $('#author-header').html(html);
  
  html = '';
  if (headlineObj.topstories) {
    for (var i = 0; i < headlineObj.topstories.length; i++) {
      var story = headlineObj.topstories[i];
      html += '<div class="topstory">'
            + '<h3 class="topstory-headline">' + story.headline + '</h3>'
            + '<h4 class="topstory-tagline">' + story.tagline + '</h2>'
            + '</div>';
    }
  }
  
  
  
  $('#author-headlines').html(html);
}

TIM.models.Event  = Backbone.Model.extend({
  // massage/normalize data in 'parse'?
});

TIM.collections.Events = Backbone.Collection.extend({
		
		url: TIM.usePreloadedEvents ? "js/events-" + TIM.pageInfo.authorName + ".js" : TIM.apiUrl + 'authors/' + TIM.pageInfo.authorName + '/events',
		
		initialize: function() {
		},
		
		//could also subclass in parse?
		parse: function(resp) {
		  return (resp.entries);
		},
		
		prepareForDisplay: function() {
		  
		},
		
		setUrl: function(name) {
		  name = name || "phil";
		  if (TIM.usePreloadedEvents) {
		    this.url = "js/events-" + TIM.pageInfo.authorName + ".js";
		  } else {
		    this.url = TIM.apiUrl + 'authors/' + TIM.pageInfo.authorName + '/events?count=200'
		  }
		}

});

TIM.views.EventList  = Backbone.View.extend({
  className: "events",
  
  initialize: function(spec) {
      _.bindAll(this, "render");
			this.page = spec.page;
  },

  render: function(tmpl, callback) {
    
		var html = "";
		var i = 0;

		
		this.collection.each(function(item) {
		  
		  var service = "facebook";
		  var type = item.get("type");
		  var origin = item.get('origin');
		  
		  if (origin.known) {
		    service = origin.known.service_name;
		  } else {
		    service = origin.unknown.domain;
		  }
		  
		  var cat = 'cat5';
		  if(type == 'photo') {
		    cat = 'cat1'
		  }
		  if(type == 'follow') {
		    cat = 'cat4'
		  }
		  if(type == 'status') {
		    cat = 'cat2'
		  }
		  if(type == 'checkin') {
		    cat = 'cat3'
		  }
		  
		  //skip correlations for now
		  if (type !== 'correlation') {
		    		    
		    var headline =  item.get('headline') || '';
  		  var content =  item.get('content') || '';

  		  var createTime = item.get("create_time");

  		  var timeago = "";

  		  if(createTime) {
  		    timeago = $.timeago(new Date(item.get("create_time") * 1000));
  		  }

  		  var attribution = timeago + ' via ' + service;

  		  var imgTag = '';
  		  var photo;

  		  //console.log("item: ",  item.get('type'));

  		  var detail = item.get('post_type_detail');
  		  if (detail && detail.photo) {
  		    photo = detail.photo[2];
  		  }

  		  if (photo) {
  		   // cat += "_cat5";
  		    imgTag = '<br><img src="' + photo.image_url  +  '"/>'
  		  }

  		  var headlineElem = headline !== '' ? ('<h2 class="box-title">' + headline + '</h2>') : '';
  		  var contentElem = (content !== '' || imgTag != '') ? ('<div class="box-text">' + content + imgTag + '<br/>') : '';

  		  html += '<div class="box ' + cat + '">'
  		        + headlineElem
    		      + '<div class="box-text">' + content + imgTag + '<br/>'
    		      + '<span class="attribution">' + attribution + '</span>'
    		      + '</div></div>';
    		i++;
  		}
  		});

      this.$el.append(html);

      if($('#content').find(this.el).length == 0)  {
        $('#content').append(this.$el);
      }

      if(callback) {
        callback(html);
      }
  }
});

//jQuery document load event
  
$(document).ready(function(){
  
  var parsedUri = parseUri(window.location.href);
  
  author = parsedUri.queryKey.author
  authorClass = "default";
  
  generateHeadline(author);
  
  if(author) {
    authorClass = "xxx-unknown";
    for(var i = 0; i < authorsWithCovers.length; i++) {
      if (authorsWithCovers[i] === author) {
        authorClass = author;
      }
    }
  }
  
  TIM.pageInfo.authorName = author || 'phil';
  
  $('body').addClass(authorClass);
	
	var $container = $('#content');
	var toFilter = '*';
	
	$container.attr('data-current',toFilter);
	
	checkActive();

	$('#nav a').click(function(){
		var title = $(this).attr('title');
		var text = $(this).text();
		if(text == "All") {
			var selector = title;
		}
		else {
			var selector = "." + title;
		}
		
		$container.attr('data-current',selector);
		
		$container.isotope({ 
			filter: selector,
			animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false,
			}
		});
		
		checkActive();
		
		return false;
	});
	
	function checkActive(){
	
	$('#nav a').each(function(){
		
		$(this).css({
			color: '#595959'
		});
	
		var title = $(this).attr('title');
				
		title = '.'+title;
		
		if(title=='.*'){
			title = '*';
		}
		
		
		var currentCat = $container.attr('data-current');
		
		if(title==currentCat){
			$(this).css({
			color: '#00ff00'
		});
		}
		
	});
	
	
	}
	
	var eventListView;
	
	TIM.eventCollection = TIM.eventCollection || new (TIM.collections.Events);
	
	TIM.eventCollection.setUrl(TIM.pageInfo.authorName);
	
	TIM.eventCollection.fetch({
	  success: function(a,b,c) {

	    eventListView = new TIM.views.EventList({collection: TIM.eventCollection});
	    
	    eventListView.render();
	    
	    $('#content').html($('.events').html());
	    
	    $('#loading').hide();
    	$('#content').fadeIn();
	    
	    $('.events').isotope({
    		filter: toFilter,
    		animationOptions: {
    			duration: 750,
    			easing: 'linear',
    			queue: false,
    		}
    	});
	  },
	  error: function(a,b,c) {
	    
	  }
	});
	
	function setTimeAndLocationHTML (authorFirstName) {
	  authorFirstName = authorFirstName || TIM.pageInfo.authorName;
	  if (authorDisplayNames[authorFirstName]) {
	    authorFirstName = authorDisplayNames[authorFirstName]
	  }
	  var html = '';
	  var timeString = getTimeString();
	  var templateContext = {
	    name: authorFirstName,
	    city: "San Francisco",
	    time: timeString
	  }
	  
	  html += "<div class='location'><p class='label'>" + templateContext.name + " is in </p>"
          + templateContext.city + "</div>"
          + "<div class='time'><p class='label'>Local Time</p>" + templateContext.time + "</div>";
    
    $('#location-and-time').html(html);
  }
  
	function getTimeString() {
	  var time=new Date();
    var hours=time.getHours();
    var minutes=time.getMinutes();
    var ampm = " AM";
    minutes=((minutes < 10) ? "0" : "") + minutes;
    if (hours > 12) {
      hours -= 12;
      ampm = " PM"
    }
    
    return hours + ":" + minutes + ampm;
	}
	
	setTimeAndLocationHTML();
	
	window.setInterval(function() {setTimeAndLocationHTML()}, 1000)
	
});