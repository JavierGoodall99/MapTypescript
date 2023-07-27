import React, { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L, { Icon, PointTuple, point } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import housesData from './houses.json'; // Import the JSON data instead of using axios
import MarkerClusterGroup from 'react-leaflet-cluster';
import "./styles.css";
import placeholderIcon from "./placeholder.png"; // Import the icon image
import { Checkbox, FluentProvider, webLightTheme } from '@fluentui/react-components';

interface House {
  vge_id: number;
  Lat: number;
  Long: number;
  Postcode: string;
  Straat: string;
  huisnummer: string;
  naam: string | null;
  geldig_vanaf: string | null;
  wijk_code: string | null;
}

const customIcon = new Icon({
  iconUrl: placeholderIcon,
  iconSize: [65, 65] as PointTuple,
});

const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

const HouseMap: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedStraat, setSelectedStraat] = useState<string | null>(null);

  useEffect(() => {
    // You can optionally fetch data from an API here, but for this example, we'll use the imported JSON data
    setHouses(housesData as House[]); // Use type assertion here
  }, []);

  const uniqueStraats = Array.from(new Set(houses.map((house) => house.Straat)));

  const handleStraatCheckboxChange = (straat: string) => {
    setSelectedStraat(prevStraat => prevStraat === straat ? null : straat);
  };

  return (
    <div className='mapping'>
      <FluentProvider theme={webLightTheme}>
      <h3>Filter by Straat:</h3>
      {uniqueStraats.map((straat) => (
        <label key={straat}>
          <Checkbox
            value={straat}
            checked={selectedStraat === straat}
            onChange={() => handleStraatCheckboxChange(straat)}
          />
          {straat}
        </label>
      ))}
      </FluentProvider>
      <MapContainer center={[52.35919189453125, 6.63872766494751]} zoom={13} style={{ height: '90vh' }}>
        <TileLayer
          attribution="Google Maps"
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
          // url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
          // url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
          maxZoom={20}
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
          {houses.map((house) => {
            if (selectedStraat && house.Straat !== selectedStraat) {
              return null; // Skip rendering markers for non-selected Straats
            }
            return (
              <Marker key={house.vge_id} position={[house.Lat, house.Long]} icon={customIcon}>
                <Popup>
                  <p>{house.Straat} {house.huisnummer}</p>
                  {house.Postcode}
                  {house.naam && <p>Name: {house.naam}</p>}
                  {house.geldig_vanaf && <p>Valid from: {house.geldig_vanaf}</p>}
                  {house.wijk_code && <p>Wijk Code: {house.wijk_code}</p>}
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default HouseMap;
