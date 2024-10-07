import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Annotation } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"; // TopoJSON of US states

const AlumniMap = () => {
  // Example data: you can replace this with actual data from your database or API
  const alumniData = {
    California: 150,
    Texas: 120,
    Florida: 90,
    "New York": 110,
    // ...add more states
  };

  const [selectedState, setSelectedState] = useState(null);

  // Color scale for number of alumni
  const colorScale = scaleLinear().domain([0, 200]).range(["#D6EAF8", "#2E86C1"]);

  // Handle click event
  const handleStateClick = (geo) => {
    const stateName = geo.properties.name;
    setSelectedState({
      name: stateName,
      alumniCount: alumniData[stateName] || 0,
    });
  };

  return (
    <div>
      <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "auto" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <React.Fragment key={geo.rsmKey}>
                <Geography
                  geography={geo}
                  onClick={() => handleStateClick(geo)}
                  style={{
                    default: {
                      fill: colorScale(alumniData[geo.properties.name] || 0),
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
                {/* Check if the centroid is available before rendering the label */}
                {geo.properties.centroid && geo.properties.centroid.length === 2 && (
                  <Annotation
                    subject={[
                      geo.properties.centroid[0], // Longitude
                      geo.properties.centroid[1], // Latitude
                    ]}
                    dx={0}
                    dy={0}
                    connectorProps={{
                      stroke: "#000",
                      strokeWidth: 0.5,
                      strokeLinecap: "round",
                    }}
                  >
                    <text x="4" fontSize={10} alignmentBaseline="middle">
                      {geo.properties.name}
                    </text>
                  </Annotation>
                )}
              </React.Fragment>
            ))
          }
        </Geographies>
      </ComposableMap>

      {selectedState && (
        <div style={{ marginTop: "20px" }}>
          <h3>{selectedState.name}</h3>
          <p>Alumni: {selectedState.alumniCount}</p>
        </div>
      )}
    </div>
  );
};

export default AlumniMap;
