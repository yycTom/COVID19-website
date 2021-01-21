const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// for COVID19_world_map
app.get("/covid19_world_map", routes.covid19_world_map);

app.get("/covid19_world_map/:date", routes.getSpecificDate);

app.get("/compare", routes.getCountryList)

app.get("/compare/:country1/:country2", routes.getCompareCountries);

app.get("/explore", routes.getCountryList)

app.get("/explore/:country", routes.getStateList)

app.get("/explore/:country/:state", routes.getCountryState);

app.get("/explore/:country/:state/:startDate/:endDate/:type", routes.getCompareGrowthCalculator)

app.get("/explore/:country/:state/:startDate/:endDate/:lag1/:lag2", routes.getCompareCorrelationCalculator)

app.get("/dropCalculator/:country/:score", routes.getCompareDropCalculator)

app.get("/firstcase/:country", routes.getFirstCaseFirstDeath)
app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
