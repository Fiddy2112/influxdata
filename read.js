require("dotenv").config();
const { InfluxDB, Point } = require("@influxdata/influxdb-client");

/** Environment variables **/
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

/** To avoid SQL injection, use a string literal for the query. */
const fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")`;
// const fluxQuery = 'from(bucket:"wp") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")';

const myQuery = async () => {
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    console.log(
      `${o._time} ${o._measurement}' (${o.sensor_id}): ${o._field}=${o._value}`
    );
  }
};

/** Execute a query and receive line table metadata and rows. */
myQuery();
