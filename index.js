require("dotenv").config();
const { InfluxDB, Point } = require("@influxdata/influxdb-client");

/** Environment variables **/
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({ url, token });

const writeApi = influxDB.getWriteApi(org, bucket);

writeApi.useDefaultTags({ region: "west" });

// const point1 = new Point("temperature")
//   .tag("sensor_id", "TLM01")
//   .floatField("value", 24.0);
// console.log(` ${point1}`);

const point2 = new Point("pressure")
  .tag("sensor_id", "P01")
  .floatField("value", 1000);
console.log(` ${point2}`);

// writeApi.writePoint(point1);
writeApi.writePoint(point2);

/**
 * Flush pending writes and close writeApi.
 **/
writeApi.close().then(() => {
  console.log("WRITE FINISHED");
});
