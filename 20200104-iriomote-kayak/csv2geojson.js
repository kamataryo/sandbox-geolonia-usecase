const fs = require("fs");
const csv = fs.readFileSync("./kayak.csv").toString();

const values = csv
  .split("\n")
  .filter(x => !!x)
  .map(line => {
    const [timestamp, latitude, longitude, altitude] = line
      .split(",")
      .map(value => parseFloat(value));
    return { latitude, longitude };
  });

values.sort((a, b) => a.timestamp - b.timestamp);

const geoJson = values.reduce(
  (prev, { latitude, longitude }, index) => {
    if (index === 0) {
      return prev;
    }
    const point = [longitude, latitude];

    prev.features[0].coordinates.push(point);
    return prev;
  },
  {
    type: "FeatureCollection",
    features: [
      {
        type: "LineString",
        coordinates: []
      }
    ]
  }
);

fs.writeFileSync("./kayak.geojson", JSON.stringify(geoJson));
