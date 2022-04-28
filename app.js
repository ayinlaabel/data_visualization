const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const mysql = require("mysql");
const alert = require("alert");
const toastr = require("toastr");
const cors = require("cors");

const app = express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "activeuser",
});

/**
 * Setting Our View Engines
 * @view: EJS
 * @public: Folder for assest
 */
// parse application/x-www-form-urlencoded
//load middleware
app.use(bodyParser.json());

//CORS HEADER MIDDLEWARE
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  // res.header("Access-Control-Allow-Credentials", "true");

  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );

  next();
});
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(cors());
/**
 * @Routing: All Routing Start here
 */

/**
 * @route: Home Route
 */
app.get("/", (req, res, next) => {
  let results = [];
  let m;
  let x = "";
  const sqlMAX = "SELECT MAX(date) AS max FROM active_user";
  const sqlMIN = "SELECT MIN(date) AS min FROM active_user";
  con.query(sqlMAX, (err, max) => {
    // console.log(max[0].max);
    let a = max[0].max;
    let b = a.split("-");
    let c = b[2] + "-" + b[1] + "-" + b[0];
    let x = c;

    con.query(sqlMIN, (err, min) => {
      // console.log(min);
      let a = min[0].min;
      let b = a.split("-");
      let c = b[2] + "-" + b[1] + "-" + b[0];
      let m = c;

      console.log(x, m);
      // res.render("index", {
      //   results,
      //   m,
      //   x,
      // });
      return res.json({ results, m, x });
    });
  });
});

// function copyData() {
//   const api = "http://sam-user-activity.eu-west-1.elasticbeanstalk.com/";
//   let data = [];
//   console.log("No result found");
//   axios
//     .get(api)
//     .then((res) => {
//       for (let key in res.data) {
//         //   console.log("test");
//         data.push([key, res.data[key]]);
//       }
//       let sql = `INSERT INTO active_user (date, active) VALUES ?`;
//       // console.log(v, key)
//       con.query(sql, [data], (err, results) => {
//         if (err) throw err;
//         console.log("Insert Succes.");
//       });
//     })
//     .catch((e) => console.log(e));
// }

app.post("/", (req, res, next) => {
  const a = req.body.startDate;
  const b = req.body.endDate;
  console.log(req.body);
  let d = a.split("-");
  let c = b.split("-");

  const s = "'" + d[2] + "-" + d[1] + "-" + d[0] + "'";
  const e = "'" + c[2] + "-" + c[1] + "-" + c[0] + "'";
  const sql = `SELECT * FROM active_user WHERE date >= ${s} AND date <= ${e}`;
  // const sql = `SELECT * FROM active_user WHERE date = ${s}`;

  console.log(s, e);
  if (a > b) {
    console.log("Wrong date selection")
    res.json({ msg: "Wrong date selection" });
  } else {
    con.query(sql, (err, results) => {
      let m, x;
      console.log(results);
      // res.render("index", {
      //   results,
      //   m,
      //   x,
      // });
      res.json(results, m, x);
    });
  }
});

/**
 * @Connect: connecting application to port
 * @Port: 8080
 */
app.listen(8080, () => console.log("Connected to port 8080"));
