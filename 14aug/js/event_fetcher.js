var TIM = {};
TIM.models = {};
TIM.collections = {};
TIM.views = {};
TIM.apiUrl = "http://api.thisis.me/v1/";
TIM.pageInfo = {
  authorName: "bryce"
}
TIM.mainCollection = undefined;

TIM.models.Event  = Backbone.Model.extend({
  
});

TIM.collections.Events = Backbone.Collection.extend({
		
		url: TIM.apiUrl + 'authors/' + TIM.pageInfo.authorName + '/events',
		
		initialize: function() {
		},
		
		//could also subclass in parse?
		parse: function(resp) {
		  return (resp.events);
		},
		
		setUrl: function(name) {
		  name = name || "phil";
		  this.url = TIM.apiUrl + 'authors/' + name + '/events';
		}

});

TIM.views.EventList  = Backbone.View.extend({
  className: "events",
  
  initialize: function(spec) {
      _.bindAll(this, "render");
			this.page = spec.page;
			this.template = "tmpl-events";
  },

  render: function(tmpl, callback) {
    
    tmpl = tmpl || this.template;
		var html = "";
		var i = 0;
		
		this.collection.each(function(item) {
		  var service = "facebook";
		  var origin = item.get('origin');
		  
		  if (origin.known) {
		    service = origin.known.service_name;
		  } else {
		    service = origin.unknown.domain;
		  }
		  
		  var headline =  item.get('headline') || 'sample headline';
		  item.set('headline', headline);
		  
		  var content =  item.get('content') || '';
		  item.set('content', content);
		  
		  var tagline =  item.get('tagline') || 'sample tagline';
		  item.set('tagline', tagline);
		  
		  var createTime = item.get("create_time");
		  
		  var timeago = "";
		  
		  if(createTime) {
		    timeago = $.timeago(new Date(item.get("create_time") * 1000));
		  }
		  
		  var attribution = timeago + ' via ' + service;
		  
		  var imgTag = '';
		  
		  var photo = item.get('photo');
		  
		  if (photo) {
		    imgTag = '<br><img src="' + photo.image_url  +  '"/>'
		  }
 
		});
		
		// Get the template's markup...
    var tmplMarkup = $('#' + tmpl).html();
    // ...tell Underscore to render the template...
    
    console.log({ events : this.collection.toJSON() });
    
    html = _.template(tmplMarkup, { events : this.collection.toJSON() });
    // ...and update part of your page:
    //$('#target').html(compiledTmpl);
		
		console.log(this)
		
    this.$el.append(html);
    
    if($('#content').find(this.el).length == 0)  {
      $('#content').append(this.$el);
    }
    
    if(callback) {
      callback(html);
    }
    
  }
});