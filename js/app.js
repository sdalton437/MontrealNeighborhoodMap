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
	this.getPlaceDetails = function(){
		var foursquare_client_id = "3TUHGAUUEZ4U2JDJ24CTJZ42JMQ4QOMD1MR2CAGKJ50ALLBD";
		var foursquare_client_secret = "REBANX5C3T3EGVESNDDO5TWX21DKPRIUVUDMBWBXJAQC0QUT";
		var clientParameters = "client_id=" + foursquare_client_id + "&client_secret=" + foursquare_client_secret;
		var latitude = locations[0].location[0];
		var longitude = locations[0].location[1];
		var searchUrl = "https://api.foursquare.com/v2/venues/search?" + clientParameters + "&v=20130815&ll=" + latitude + "," + longitude;
		console.log(searchUrl);
	}		
 
}




var populateInfoWindow = function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      
      // Open the infowindow on the correct marker.
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
	var foursquare_client_id = "3TUHGAUUEZ4U2JDJ24CTJZ42JMQ4QOMD1MR2CAGKJ50ALLBD";
	var foursquare_client_secret = "REBANX5C3T3EGVESNDDO5TWX21DKPRIUVUDMBWBXJAQC0QUT";
	var clientParameters = "client_id=" + foursquare_client_id + "&client_secret=" + foursquare_client_secret;
	var latitude = locations[0].location.lat;
	var longitude = locations[0].location.lng;
	var nameSpaces = locations[0].title;
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
			console.log(venueName);
			console.log(venueId);
			var infoUrl = "https://api.foursquare.com/v2/venues/" + venueId + "?" + clientParameters + "&v=20130815";
			$.ajax({
				url: infoUrl,
				dataType : "json",
				success: function(data){
					var info = data.response.venue;
					var name = info.name;
					var daysOpen = info.hours.timeframes[0].days;
					var hours = info.hours.timeframes[0].open[0].renderedTime;
					var review = info.tips.groups[0].items[0].text;

					console.log(name);
					console.log(daysOpen);
					console.log(hours);
					console.log(review);
				}
			});
			console.log(infoUrl);
		},
		error: function(){
			var venueName = "No name";
			console.log(venueName);
		}
	});
	
	
}
