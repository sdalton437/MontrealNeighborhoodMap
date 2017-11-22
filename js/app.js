var map;
var placeMarkers = [];
var markers = [];

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
}



var ViewModel = function(){
	
	var self = this;
	this.markers = [];
	this.listView = ko.observableArray([]);
	locations.forEach(function(data){
		self.markers.push(new initMarkers(data));
	});

	locations.forEach(function(data){
		self.listView.push(new initMarkers(data));
	});

	
	this.textSearchPlaces = function(){
		self.listView.removeAll();
		locations.forEach(function(data){
			self.listView.push(new initMarkers(data));
		});
		var query = document.getElementById('filter-results-text').value.toLowerCase();
				//console.log(self.listView().length);
		var toDelete = [];
		var counter = 0;
		//console.log(self.listView()[2].title.toLowerCase().includes(query));
		//console.log(self.markers.length);
		for(var i=0; i<self.listView().length; i++){
			console.log(self.listView()[i].title);
			
			if(self.listView()[i].title.toLowerCase().search(query) == -1){
				toDelete.push(i);
			}
			//console.log(!self.markers[i].title.includes(query));
			//console.log(self.markers[i]);
		}
		while(toDelete.length){
			self.listView.splice(toDelete.pop(),1);
		}
		//console.log(query);
	}
 
}


function initMap(){
	map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.5163646, lng: -73.5763104},
      zoom: 14,
      mapTypeControl: false
    });
	ko.applyBindings(new ViewModel());
}