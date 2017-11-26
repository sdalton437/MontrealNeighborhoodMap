var map;
var placeMarkers = [];
var largeInfowindow;


var locations = [
  {title: 'Bar Darling', location: {lat: 45.518842, lng: -73.584071}},
  {title: 'La Banquise', location: {lat: 45.5253521, lng: -73.5747681}},
  {title: 'Divan Orange', location: {lat: 45.518224, lng: -73.582543}},
  {title: 'Bar Bikteck St-Laurent', location: {lat: 45.5145979, lng: -73.5743797}},
  {title: 'Mckibbins Irish Pub', location: {lat: 45.5134263, lng: -73.5712162}},
  {title: 'Pitarifique', location: {lat: 45.5178508, lng: -73.5816863}}
];

var initMarkers = function(data){
	var self = this;
	this.title = data.title;
	this.position = data.location;

	this.marker = new google.maps.Marker({
	  position: self.position,
	  title: self.title,
	  animation: google.maps.Animation.DROP,
	  map: map
	});

	this.marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
    });
}



var ViewModel = function(){
	
	var self = this;
	this.markers = [];
	this.listView = ko.observableArray();

	//Populate markers array
	locations.forEach(function(data){
		self.markers.push(new initMarkers(data));
	});
	console.log(self.markers[0]);
	//Populate list view array
	locations.forEach(function(data){
		self.listView.push(data);
	});

	this.listViewPopulate = function(data){
		for(var j=0;j<self.markers.length;j++){
			console.log("reacded");
			console.log(data);
			if(data.title == self.markers[j].title){
				populateInfoWindow(self.markers[j].marker, largeInfowindow);
				console.log(self.markers[j]);
			}
		}
	}

	console.log(self.listView()[0]);
	this.textSearchPlaces = function(){
		for(var x = 0;x<self.markers.length;x++){
			self.markers[x].marker.setMap(null);
		};

		self.listView.removeAll();

		var query = document.getElementById('filter-results-text').value.toLowerCase();
		console.log(self.listView().length);
		var counter = 0;

		for(var i=0; i<locations.length; i++){
			var index = locations[i].title.toLowerCase().search(query);
			if(index != -1){
				self.listView.push(locations[i]);
				self.markers[i].marker.setMap(map);
			}
		}
	}
	
}




var populateInfoWindow = function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
    	console.log(marker);
    	marker.setAnimation(google.maps.Animation.BOUNCE);
    	infowindow.setOptions({maxWidth:250});
      	// Clear the infowindow content to give the streetview time to load.
      	infowindow.setContent('');
      	infowindow.marker = marker;
      	// Make sure the marker property is cleared if the infowindow is closed.
      	infowindow.addListener('closeclick', function() {
        	infowindow.marker = null;
        	marker.setAnimation(null);
      	});
      	var foursquare_client_id = "3TUHGAUUEZ4U2JDJ24CTJZ42JMQ4QOMD1MR2CAGKJ50ALLBD";
		var foursquare_client_secret = "REBANX5C3T3EGVESNDDO5TWX21DKPRIUVUDMBWBXJAQC0QUT";
		var clientParameters = "client_id=" + foursquare_client_id + "&client_secret=" + foursquare_client_secret;
		for(var i=0;i<locations.length;i++){
			var locationToGenerate;
			if(marker.title == locations[i].title){
				locationToGenerate = locations[i];
			}
		}
			var latitude = locationToGenerate.location.lat;
			var longitude = locationToGenerate.location.lng;
			var nameSpaces = locationToGenerate.title;
			var name = nameSpaces.split(' ').join('_');
			var searchUrl = "https://api.foursquare.com/v2/venues/search?" + clientParameters + "&v=20130815&ll=" + latitude + "," + longitude + "&query=" + name;
			var venueId;
			$.ajax({
				url: searchUrl,
				dataType: "json",
				success: function(data){
					var venue = data.response.venues;
					var venueName = venue[0].name;
					venueId = venue[0].id;
					var infoUrl = "https://api.foursquare.com/v2/venues/" + venueId + "?" + clientParameters + "&v=20130815";
					$.ajax({
						url: infoUrl,
						dataType : "json",
						success: function(data){
							console.log(infoUrl);
							var innerHTML = "<div>"
							var info = data.response.venue;
							try{
								var name = info.name;
								
							}
							catch(err){
								var name = "No data";
								innerHTML += "<strong>No Name Data</strong";
							}
							try{
								var daysOpen = info.hours.timeframes[0].days;	
							}
							catch(err){
								var daysOpen = "No data";
							}
							try{
								var hours = info.hours.timeframes[0].open[0].renderedTime;
							}
							catch(err){
								var hours = "No data";
							}
							try{
								var review = info.tips.groups[0].items[0].text;
							}
							catch(err){
								var review = "No data";
							}
							try{
								var photo = info.photos.groups[0].items[0].prefix + "200x200" + info.photos.groups[0].items[0].suffix;
							}
							catch(err){
								var photo = "";
							}

							innerHTML += "<strong>" + name + "</strong>";
							innerHTML += "<br><br> <img src=" + photo + ">";
							innerHTML += "<br>Open: " + daysOpen;
							innerHTML += ", " + hours;
							innerHTML += '<br> Reviews: "' + review + '"';
							
							innerHTML += '</div>';
							infowindow.setContent(innerHTML);
							console.log(name);
						}
					});
				},
				error: function(){
					var venueName = "No name";
					console.log(venueName);
				}
			});
		infowindow.open(map, marker);
	}
}
	

function initMap(){
	map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.5163646, lng: -73.5763104},
      zoom: 14,
      mapTypeControl: false
    });
    largeInfowindow = new google.maps.InfoWindow();
	ko.applyBindings(new ViewModel());
	
}
