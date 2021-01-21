import pandas as pd
import os

#################
### Happiness ###
#################
dir_name = "Original_Data/happiness/"
files = os.listdir(dir_name)
happiness_index = {}
for file_name in files:
    year = file_name[:-4]
    if year in ["2020"]:
        subset = ['Country name', 'Ladder score']
    elif year in ["2019", "2018"]:
        subset = ['Country or region', 'Score']
    elif year in ['2017']:
        subset = ['Country', 'Happiness.Score']
    elif year in ['2016', '2015']:
        subset = ['Country', 'Happiness Score']
    else:
        print("No data for year", year)
    happiness_index[year] = pd.read_csv(dir_name + file_name).dropna(subset = subset)

with open('processed/Happiness.csv', 'w') as f:
    print("country,year,score", file = f)
    for year in happiness_index.keys():
        tab = happiness_index[year]
        for instance in happiness_index[year].values.tolist():
            if year in ["2020", "2017"]:
                print("%s,%s,%.2f" % (instance[0], year, instance[2]), file = f)
            elif year in ["2019", "2018"]:
                print("%s,%s,%.2f" % (instance[1], year, instance[2]), file = f)
            elif year in ["2016", "2015"]:
                print("%s,%s,%.2f" % (instance[0], year, instance[3]), file = f)
                
###############
### Country ###         
###############
country_info = {}
GDP = pd.read_csv("Original_Data/country_info/" + "GDP_per_capita.csv").dropna(subset = ['Country', 'GDP per capita']).values.tolist()
for instance in GDP:
    country_info[instance[0]] = {"GDP": instance[1]}

life_exp = pd.read_csv("Original_Data/country_info/" + "Life_expectancy.csv").dropna(subset = ['Country', 'Life expectancy']).values.tolist()
for instance in life_exp:
    if instance[0] in country_info.keys():
        country_info[instance[0]]["life_exp"] = instance[1]
    else:
        country_info[instance[0]] = {"life_exp": instance[1]}
        #print("creating new key in country_info:", instance[0])

med_age = pd.read_csv("Original_Data/country_info/" + "Median_age.csv").dropna(subset = ['Country', 'Median age']).values.tolist()
for instance in med_age:
    if instance[0] in country_info.keys():
        country_info[instance[0]]["med_age"] = instance[1]
    else:
        country_info[instance[0]] = {"med_age": instance[1]}
        #print("creating new key in country_info:", instance[0])
        
with open("processed/Country.csv", 'w') as f:
    print("country,med_age,life_expectancy,gdp", file = f)
    for country in country_info.keys():
        if len(country_info[country].keys()) == 3:
            print("%s,%.1f,%.1f,%.1f" % (country, country_info[country]["med_age"], country_info[country]["life_exp"], country_info[country]["GDP"]), file = f)
            
###################          
### Case_Gender ###            
###################
with open("processed/Case_Gender.csv", 'w') as f:
    gender = pd.read_csv("Original_Data/gender.csv").dropna(subset = ["Country", "Cases (% male)", "Cases (% female)"]).values.tolist()
    print("country,female_percent,male_percent", file = f)
    for instance in gender:
        print("%s,%s,%s" % (instance[1], instance[5], instance[6]), file = f)
        
###################        
### Air_Traffic ###
###################
with open("processed/Air_Traffic.csv", 'w') as f:
    air_traffic = pd.read_csv("Original_Data/covid_impact_on_airport_traffic.csv").dropna(subset = ['Date', 'AirportName']).values.tolist()
    print("airport,date,country,state,city,baseline_percent", file = f)
    for instance in air_traffic:
        print("%s,%s,%s,%s,%s,%d" % (instance[3], instance[1], instance[9], instance[7], instance[6], instance[4]), file = f)
        
#############
### COVID ###
#############
with open("processed/COVID.csv", 'w') as f:
    covid = pd.read_csv("Original_Data/covid_19_all.csv").dropna(subset = ['Country/Region', 'Province/State', 'Date']).values.tolist()
    print("country,province,date,longitude,latitude,confirmed,death,recovered", file = f)
    for instance in covid:
        print("%s,%s,%s,%.2f,%.2f,%.f,%.f,%.f" % (instance[0], instance[1], instance[7], instance[3], instance[2], instance[4], instance[6], instance[5]), file = f)
