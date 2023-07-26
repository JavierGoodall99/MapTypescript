import React, { useState } from "react";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { Icon, point, PointTuple } from "leaflet";
import CategoryFilter from "./CategoryFilter";
import { SearchBox } from '@fluentui/react-search-preview';
import { Field, FluentProvider, webLightTheme,  } from "@fluentui/react-components";



const customIcon = new Icon({
  iconUrl: require("./icons/placeholder.png"),
  iconSize: [65, 65] as PointTuple, // size of the icon
});

const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

interface MarkerInfo {
  geocode: number[];
  popUp: string;
  img: string;
  category: string;
}

const markers: MarkerInfo[] = [
  {
    geocode: [-33.962864, 18.409834],
    popUp: "Table Mountain",
    img: "https://images.pexels.com/photos/4064211/pexels-photo-4064211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Hiking Trails" 
  },
  {
    geocode: [-33.906546, 18.419288],
    popUp: "V&A Waterfront",
    img: "https://daddysdeals.co.za/wp-content/uploads/2022/09/Cape-Wheel-12345678.jpg",
    category: "Resturants"
  },
  {
    geocode: [-33.950855, 18.378505],
    popUp: "Camps Bay",
    img: "https://www.intotours.co.za/media/cache/2b/f4/2bf49d6cc67bddcbc93c44570eca14d8.jpg",
    category: "Resturants"
  },
  {
    geocode: [-33.98721, 18.432312],
    popUp: "Kirstenbosch National Botanical Garden",
    img: "https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/8/2017/01/ERMHR7-e1553876093783.jpg",
    category: "Hiking Trails" 
  },
  {
    geocode: [-33.957652, 18.461199],
    popUp: "University of Cape Town",
    img: "https://cisp.cachefly.net/assets/articles/images/resized/0001056125_resized_uctuppercampuslandscapeview1022.jpg",
    category: "Education & Schools"
  }
];

interface LocationDetailsProps {
  marker: MarkerInfo;
}

function LocationDetails({ marker }: LocationDetailsProps) {
  return (
    <div className="location-details">
      {marker.img && (
        <img src={marker.img} alt="Location" className="location-image" />
      )}
      <div className="location-content">
        <h3>Location Details:</h3>
        <p>Place: {marker.popUp}</p>
        <p>Latitude: {marker.geocode[0]}</p>
        <p>Longitude: {marker.geocode[1]}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "Hiking Trails", label: "Hiking Trails" },
    { value: "Resturants", label: "Resturants" },
    { value: "Education & Schools", label: "Education & Schools" },
  ];

  const handleMarkerClick = (marker: MarkerInfo) => {
    setSelectedMarker(marker);
  };

  const handleFilterChange = (filterValue: string) => {
    setSelectedFilter(filterValue);
  };

  const filteredMarkers =
    selectedFilter === "all"
      ? markers
      : markers.filter((marker) => marker.category === selectedFilter);

  return (
    <div className="container">
      {/* Left column */}
      <div className="side-left">
        <CategoryFilter
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="side-right">
    <MapContainer className="map-container" center={[-33.923333, 18.422222]} zoom={13}>
      <FluentProvider theme={webLightTheme}>
      <SearchBox className="search" placeholder="Zoeken" size="medium" />
    </FluentProvider>
      <TileLayer
        attribution="Google Maps"
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
        // url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
        // url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
        {filteredMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={[...marker.geocode] as L.LatLngExpression}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(marker)
            }}
          >
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      {selectedMarker && (
        <div className="side-list">
          <LocationDetails marker={selectedMarker} />
        </div>
      )}
    </MapContainer>
    </div>
    </div>
  );
}
