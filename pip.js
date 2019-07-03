const csv = require("csv-parser");
const fs = require("fs");
const results = {};

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", data => {
    const { lat, lng, id_n, ...dataRest } = data;
    let id = `${lat}_${lng}_${id_n}`;

    if (results[id]) {
      if (results[id].data) {
        results[id].data.push(dataRest);
      } else {
        results[id].data = [dataRest];
      }
    } else {
      results[id] = {
        id,
        id_p: `${lat}_${lng}`,
        id_n,
        lat,
        lng,
        data: [dataRest]
      };
    }
  })
  .on("end", () => {
    var wstream = fs.createWriteStream("formatedData.json");
    wstream.write("[\n");
    for (key in results) {
      wstream.write(JSON.stringify(results[key]) + ",\n");
    }
    wstream.write("{}\n");
    wstream.write("]\n");
    wstream.end();
  });
