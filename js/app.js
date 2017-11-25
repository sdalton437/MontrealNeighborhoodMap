var map;
var placeMarkers = [];
var markers = [];
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
		var query = document.getElementById('filter-results-text').value.toLowerCase();
		console.log(self.listView().length);
		var toDelete = [];
		var counter = 0;
		console.log(markers[0]);
		//console.log(self.listView()[2].title.toLowerCase().includes(query));
		//console.log(self.markers.length);
		for(var i=0; i<self.listView().length; i++){
			console.log(self.listView()[i].title);
			
			if(self.listView()[i].title.toLowerCase().search(query) == -1){
				toDelete.push(i);
				for(var j=0;j<self.markers.length;j++){
					if(self.listView()[i].title == self.markers[j].title){
						self.markers[j].marker.setMap(null);
					}
				}
			}
			//console.log(!self.markers[i].title.includes(query));
			//console.log(self.markers[i]);
		}
		while(toDelete.length){
			self.listView.splice(toDelete.pop(),1);
		}
		console.log(self.listView().length);
		//console.log(query);
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
	
}
