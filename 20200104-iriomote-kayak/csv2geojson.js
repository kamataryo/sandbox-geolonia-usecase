const fs = require("fs");
const csv = fs.readFileSync("./kayak.csv").toString();

const geoJson = csv
  .split("\n")
  .filter(x => !!x)
  .reduce(
    (prev, line, index) => {
      if (index === 0) {
        return prev;
      }
      const [timestamp, latitude, longitude, altitude] = line.split(",");

      const point = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        properties: {
          timestamp,
          altitude
        }
      };
      prev.features.push(point);
      return prev;
    },
    {
      type: "featureCollections",
      features: []
    }
  );

geoJson.features.sort(
  (a, b) => a.properties.timestamp - b.properties.timestamp
);

fs.writeFileSync("./kayak.geojson", JSON.stringify(geoJson));
