# COVID19-website

The website provides users an overview of COVID19 situation across the world from Jan 31th to Dec 03. Here is the general framework.

![WechatIMG8](https://user-images.githubusercontent.com/47706926/105273173-c54fcd80-5b68-11eb-8482-055c25be0e45.png)

Our website is a React application, a web framework written in Javascript and that runs within a React17 environment. We polish our websites by using CSS. We store our datasets in MySQL(use RDS hosted on AWS). Here are List of Pages of our application:

## Home
A picture with brief introduction to COVID-19. Four pictures are listed as columns below : Covid19_world_map, Compare, Explore and First_case_death. We can either click pictures or the navbar to access the page.

<img width="1664" alt="Screen Shot 2021-01-20 at 9 38 30 PM" src="https://user-images.githubusercontent.com/47706926/105272683-de0bb380-5b67-11eb-8bdc-8f887386f5e6.png">

<img width="1672" alt="Screen Shot 2021-01-20 at 9 38 37 PM" src="https://user-images.githubusercontent.com/47706926/105272745-f7acfb00-5b67-11eb-9bb3-c362579333f8.png">

## Covid19_world_map
The initial page is about the latest Covid19 situation in each country. Users can input country name and date. If the name of the country exists, it will display detailed Covid19 information about this country. And the whole map will update according to the date.

![WechatIMG4](https://user-images.githubusercontent.com/47706926/105273021-7a35ba80-5b68-11eb-83d4-f4200aa14921.png)

## Country Compare
Enable users to input two countries. And show 3 graphs for each country. The first graph shows the correlation between confirmed cases, Death, Recovered and date. The second graph shows median age, life expectancy and GDP in that country. The third graph shows the percentage of female and male.

<img width="1526" alt="WechatIMG5" src="https://user-images.githubusercontent.com/47706926/105273044-891c6d00-5b68-11eb-9dce-a31c357b344e.png">

## Explore Impact
We enable users to input a country and a state/province in this country. After clicking the search button, it will display three graphs which represent the COVID19 info with time change, traffic volume with time change and happiness index over recent few years. On the right side, we allow users to calculate three sets of data. First, when user inputs start date, end date, type, it will display the growth rate. Second, when user inputs start date, end date, correlation lag, it will display correlation between air traffic volume and COVID19 case data with a shift (the shift is to model the delayed impact of COVID 19). Third, when the user inputs the metrics type, which can be percentage or magnitude, the calculator would display how much change has occurred in 2020 in terms of SELECTed metrics.


<img width="1376" alt="WechatIMG6" src="https://user-images.githubusercontent.com/47706926/105273095-9df90080-5b68-11eb-8c79-8d476e9c950a.png">

## Explore Origin
Enable users to SELECT a country. The page will show the date of first case, age of first case person, last visited country, date of first death, age of first death and external source of the first case and external source of the first death.

<img width="1668" alt="WechatIMG7" src="https://user-images.githubusercontent.com/47706926/105273196-cda80880-5b68-11eb-982f-f2c2fd391f3e.png">

