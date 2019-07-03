const turf = require("@turf/turf");
const fs = require("fs");
const { Parser } = require("json2csv");

function precise(x) {
  return Number.parseFloat(x).toFixed(1);
}

var points = turf
  .randomPoint(200000, { bbox: [48.0, 2.0, 48.5, 2.5] })
  .features.map(({ geometry }) => ({
    lat: precise(geometry.coordinates[0]),
    lng: precise(geometry.coordinates[1]),
    id_n: parseInt(Math.random() * 1000),
    k: 1,
    s: 1
  }));

const incrementP = i => points.map(p => ({ ...p, k: p.k + i, s: p.s + i }));
const data = [
  ...points,
  ...incrementP(1),
  ...incrementP(2),
  ...incrementP(3),
  ...incrementP(4),
  ...incrementP(5)
];

const fields = ["lat", "lng", "id_n", "k", "s"];
const opts = { fields };

try {
  const parser = new Parser(opts);
  const csv = parser.parse(data);
  fs.writeFile("data.csv", csv, console.log);
} catch (err) {
  console.error(err);
}
