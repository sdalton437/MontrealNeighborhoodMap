//Define good locations in Montreal
var locations = [
  {title: 'Bar Darling', location: {lat: 45.518842, lng: -73.584071}},
  {title: 'La Banquise', location: {lat: 45.5253521, lng: -73.5747681}},
  {title: 'Divan Orange', location: {lat: 45.518224, lng: -73.582543}},
  {title: 'Apt-200', location: {lat: 45.514586, lng: -73.5754871}},
  {title: 'Mckibbins Irish Pub', location: {lat: 45.5134263, lng: -73.5712162}},
  {title: 'Pitarifique', location: {lat: 45.5178508, lng: -73.5816863}}
];

//Function to create markers, given location data from locations array
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
	//Create empty markers array
	this.markers = [];
	//Create listView ko observable array
	this.listView = ko.observableArray();

	//Populate markers array
	locations.forEach(function(data){
		self.markers.push(new initMarkers(data));
	});

	//Populate list view array
	locations.forEach(function(data){
		self.listView.push(data);
	});

	//Function that populates infowindow when listview item is clicked
	this.listViewPopulateInfoWindow = function(data){
		for(var j=0;j<self.markers.length;j++){
			if(data.title == self.markers[j].title){
				populateInfoWindow(self.markers[j].marker, largeInfowindow);
			}
		}
	}

	//Function that filters locations
	this.filterPlaces = function(){
		//Set all markers' map to null
		for(var x = 0;x<self.markers.length;x++){
			self.markers[x].marker.setMap(null);
		};

		//Remove all items from listView array
		self.listView.removeAll();
		//Get user query in lower case
		var query = document.getElementById('filter-results-text').value.toLowerCase();

		//Search through locations array
		for(var i=0; i<locations.length; i++){
			var index = locations[i].title.toLowerCase().search(query);
			//if query is found in array, push that location to listView and set map
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
    	//Set animation to bounce to alert user marker is selected
    	marker.setAnimation(google.maps.Animation.BOUNCE);
    	//Set max width of info window
    	infowindow.setOptions({maxWidth:250});
      	infowindow.marker = marker;
      	// Make sure the marker property  and animation is cleared if the infowindow is closed.
      	infowindow.addListener('closeclick', function() {
        	infowindow.marker = null;
        	marker.setAnimation(null);
      	});
      	var foursquare_client_id = '3TUHGAUUEZ4U2JDJ24CTJZ42JMQ4QOMD1MR2CAGKJ50ALLBD';
		var foursquare_client_secret = 'REBANX5C3T3EGVESNDDO5TWX21DKPRIUVUDMBWBXJAQC0QUT';
		var clientParameters = 'client_id=' + foursquare_client_id +
			'&client_secret=' + foursquare_client_secret;
		for(var i=0;i<locations.length;i++){
			var locationToGenerate;
			//Get location details to generate
			if(marker.title == locations[i].title){
				locationToGenerate = locations[i];
			}
		}
		var latitude = locationToGenerate.location.lat;
		var longitude = locationToGenerate.location.lng;
		var nameSpaces = locationToGenerate.title;
		//Remove spaces in name
		var name = nameSpaces.split(' ').join('_');
		var searchUrl = 'https://api.foursquare.com/v2/venues/search?' + clientParameters +
			'&v=20130815&ll=' + latitude + ',' + longitude + '&query=' + name;
		var venueId;
		$.ajax({
			//Search Foursquare for venues with specified name and lat,lng
			url: searchUrl,
			dataType: 'json',
			//If success, search fouursquare for details on location
			success: function(data){
				var venue = data.response.venues;
				var venueName = venue[0].name;
				venueId = venue[0].id;
				var infoUrl = 'https://api.foursquare.com/v2/venues/' + venueId +
					'?' + clientParameters + '&v=20130815';
				$.ajax({
					//Search foursquare for details on location with received venueID
					url: infoUrl,
					dataType : 'json',
					success: function(data){
						var innerHTML = "<div>"
						var info = data.response.venue;
						//Try to find name
						try{
							var name = info.name;
							innerHTML += '<h2 style="text-align:center;">' + name + '</h2>';
						}
						catch(err){
						}
						//Try to find photo
						try{
							var photo = info.photos.groups[0].items[0].prefix +
								'250x200' + info.photos.groups[0].items[0].suffix;
							innerHTML += '<img src=' + photo + '>';
						}
						catch(err){
						}
						//Try to find days and hours the venue is open
						try{
							for(var i=0;i<7;i++){
								var daysOpen = info.hours.timeframes[i].days;
								innerHTML += '<br>Open: ' + daysOpen;
								var hours = info.hours.timeframes[i].open[i].renderedTime;
								innerHTML += ', ' + hours;
							}
						}
						catch(err){
						}

						//Try to find a review
						try{
							var review = info.tips.groups[0].items[0].text;
							innerHTML += '<br> Reviews: ' + '<div style="font-style:italic;padding-left: 5px;">'
								+ '"' + review + '"</div>';
						}
						catch(err){
						}
						//Try to find user that wrote the review
						try{
							var user = info.tips.groups[0].items[0].user.firstName +
								' ' + info.tips.groups[0].items[0].user.lastName;
							innerHTML += '<div style="padding-left:10px;">- ' + user + '</div>';
						}
						catch(err){
						}

						innerHTML += '<br><div style="font-style: italic;"> Data Provided by Foursquare </div></div>';
						infowindow.setContent(innerHTML);
					},
					//If error, alert user
					error: function(){
						alert('Foursquare API could not be loaded');
					}
				});
			},
			//If error, alert user
			error: function(){
				alert('Foursquare API could not be loaded');
			}
		});
		//Open the window on the marker
		infowindow.open(map, marker);
	}
}

//Function to initiate the map
function initMap(){
	//Create new map
	map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.5163646, lng: -73.5763104},
      zoom: 14,
      mapTypeControl: false
    });
    //Create new infowindow
    largeInfowindow = new google.maps.InfoWindow();
	ko.applyBindings(new ViewModel());

}
