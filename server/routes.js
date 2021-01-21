var config = require("./db-config.js");
var mysql = require("mysql");

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* ---- COVID19_world_map initial ---- */
function covid19_world_map(req, res) {
  var query = `select country, sum(confirmed) as confirmed, sum(death) as death, sum(recovered) as recovered from COVID where date = '2020-10-03' group by country; 
                select * from LatLng`;
  connection.query(query, [1, 2], function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  });    
}

/* ---- COVID19_world_map search date ---- */
function getSpecificDate(req, res) {
  var date = req.params.date
  var query = `select country, sum(confirmed) as confirmed, sum(death) as death, sum(recovered) as recovered from COVID where date = '${date}' group by country`;       
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  });  
}

/* ---- get country list ---- */
function getCountryList (req, res) {
  var query = `select distinct country from Country`
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  });  
}

/* ---- get state list ---- */
function getStateList (req, res) {
  var country = req.params.country
  var query = `select distinct province from COVID where country = '${country}' and province != 'nan'`
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  });  
}

/* ---- compare search two countries ---- */
function getCompareCountries(req, res) {
  var country1 = req.params.country1
  var country2 = req.params.country2
  // first query is to output country1, country2 name and death, confirmed in each country
  // second query is to output country1, country2 name and med_age, life_expectancy, gdp
  // second is to output country1, country2 name, female_percent, male_percent 
  
  var query = `select country, date, sum(confirmed) as confirmed, sum(death) as death, sum(recovered) as recovered from COVID where country = '${country1}' group by country, date;
                select country, date, sum(confirmed) as confirmed, sum(death) as death, sum(recovered) as recovered from COVID where country = '${country2}' group by country, date;                 
                select country, med_age, life_expectancy, gdp from Country where country = '${country1}';
                 select country, med_age, life_expectancy, gdp from Country where country = '${country2}';
                 select country, female_percent, male_percent from Case_Gender where country = '${country1}';
                 select country, female_percent, male_percent from Case_Gender where country = '${country2}';`
  connection.query(query, [1, 2, 3, 4, 5, 6], function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  });   
}

/* ---- Compare Page : First graph ---- */
function getCountryState(req, res) {
  var country = req.params.country
  var state = req.params.state
  //first query is used for first graph

  var query = `WITH Province_cases AS (
                SELECT date, 
                  SUM(confirmed) AS confirmed, 
                      SUM(death) AS death, 
                      SUM(recovered) AS recovered, 
                      SUM(confirmed) - SUM(death) - SUM(recovered) AS existing
                FROM COVID
                WHERE country = '${country}' AND province = '${state}'
                GROUP BY date
                ORDER BY date
              )
              SELECT date,
                confirmed - LAG(confirmed) OVER (ORDER BY date) AS daily_confirmed,
                  death - LAG(death) OVER (ORDER BY date) AS daily_death,
                  recovered - LAG(recovered) OVER (ORDER BY date) AS daily_recovered,
                  existing - LAG(existing) OVER (ORDER BY date) AS daily_existing
              FROM Province_cases;
              
              SELECT date, AVG(baseline_percent) as traffic
                FROM Air_Traffic
                WHERE country = '${country}' AND state = '${state}'
                GROUP BY date
                ORDER BY date;

              SELECT year, score
                FROM Happiness
                WHERE country = '${country}';
              `
  connection.query(query,[1,2,3],function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  }); 
}

/* ---- Compare page : Growth calculator ---- */
function getCompareGrowthCalculator(req, res) {
  var country = req.params.country
  var state = req.params.state
  var startDate = "2020-" + req.params.startDate
  var endDate = "2020-" + req.params.endDate
  var selectedType = req.params.type
  
  var query = `WITH Province_cases AS (
	SELECT date, 
		SUM(confirmed) AS confirmed, 
        SUM(death) AS death, 
        SUM(recovered) AS recovered, 
        SUM(confirmed) - SUM(death) - SUM(recovered) AS existing
	FROM COVID
	WHERE country = '${country}' AND province = '${state}'
	GROUP BY date
    HAVING date >= '${startDate}' AND date <= '${endDate}'
	ORDER BY date
),
Daily_Amount AS (
	SELECT date, ${selectedType} - LAG(${selectedType}) OVER (ORDER BY date) AS daily_amount
	FROM Province_cases
)

SELECT AVG(daily_amount) AS grow_rate
FROM Daily_Amount;`
  connection.query(query,function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
      console.log(selectedType)
    }
  }); 
}

/* ---- Compare page : Correlation Calculator ---- */
function getCompareCorrelationCalculator(req, res) {
  var country = req.params.country
  var state = req.params.state
  var startDate = "2020-" + req.params.startDate
  var endDate = "2020-" + req.params.endDate
  var lag = parseInt(req.params.lag1)
  var query = `WITH Province_cases AS (
	SELECT date, 
		SUM(confirmed) AS confirmed, 
        SUM(death) AS death, 
        SUM(recovered) AS recovered, 
        SUM(confirmed) - SUM(death) - SUM(recovered) AS existing
	FROM COVID
	WHERE country = '${country}' AND province = '${state}'
	GROUP BY date
    HAVING date >= '${startDate}' AND date <= '${endDate}'
	ORDER BY date
),
Province_daily_cases AS (
	SELECT date,
	confirmed - LAG(confirmed) OVER (ORDER BY date) AS metrics
	FROM Province_cases
),
Air_daily_baselines AS (
	SELECT date, AVG(baseline_percent) AS baseline_percent
	FROM Air_Traffic
	WHERE country = '${country}' AND state = '${state}'
	GROUP BY date
	ORDER BY date
),
timeline_data AS (
	SELECT p.date AS date, p.metrics AS x, a.baseline_percent AS y
	FROM Province_daily_cases p INNER JOIN Air_daily_baselines a on p.date = a.date
),
timeline_data_lag AS (
	SELECT x, LAG(y, ${lag}) OVER (ORDER by date) AS y
	FROM timeline_data
)

SELECT (avg(x * y) - avg(x) * avg(y)) / (sqrt(avg(x * x) - avg(x) * avg(x)) * sqrt(avg(y * y) - avg(y) * avg(y))) AS correlation_coefficient_population,
	 (count(*) * sum(x * y) - sum(x) * sum(y)) / (sqrt(count(*) * sum(x * x) - sum(x) * sum(x)) * sqrt(count(*) * sum(y * y) - sum(y) * sum(y))) AS correlation_coefficient_sample
FROM timeline_data_lag;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
      console.log(rows)
    }
  });    
}

/* ---- Compare page : Drop Calculator ---- */
function getCompareDropCalculator(req, res) {
  var country = req.params.country
  var score = req.params.socre
  var query = `SELECT 
	((SELECT AVG(score) FROM Happiness WHERE country = '${country}' AND year = 2020) - 
	(SELECT AVG(score) FROM Happiness WHERE country = '${country}' AND year < 2020)) /
    (SELECT AVG(score) FROM Happiness WHERE country = '${country}' AND year < 2020) 
AS increase_percent;

SELECT 
	((SELECT AVG(score) FROM Happiness WHERE country = '${country}' AND year = 2020) - 
	(SELECT AVG(score) FROM Happiness WHERE country = '${country}' AND year < 2020)) 
AS increase_score;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  });    
}


/* ---- First case and first death ---- */
function getFirstCaseFirstDeath(req, res) {
  var country = req.params.country
  var query = `select date_of_first_case, last_visited_country, age_of_first_case, date_of_first_death, 
  age_of_first_death from First_Case_First_Dead where country='${country}';
  select source1 from FirstCaseReferences where country='${country}';
  select source1 from FirstDeathReferences where country='${country}';
  `;
  connection.query(query, [1,2,3], function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
      console.log(rows)
    }
  });    
}



// The exported functions, which can be accessed in index.js.
module.exports = {
  covid19_world_map: covid19_world_map,
  getSpecificDate : getSpecificDate,
  getCountryList : getCountryList,
  getCompareCountries : getCompareCountries,
  getCountryState : getCountryState,
  getStateList : getStateList,
  getCompareGrowthCalculator : getCompareGrowthCalculator,
  getCompareCorrelationCalculator : getCompareCorrelationCalculator,
  getCompareDropCalculator : getCompareDropCalculator,
  getFirstCaseFirstDeath : getFirstCaseFirstDeath
};
