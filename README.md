# chipLCD
Simple weather station using 1602 text lcd and chip $9 computer

## Features
* outdoors temperature and humidity using [OpenWeatherMap](https://openweathermap.org/) api
* indoors temperature and humidity using HTU21D-based sensor board
* clock

## Prerequisites

* [chip board](https://getchip.com/pages/chip)
* Generic 1602 LCD with i2c adapter for convenience
* Generic HTU21D breakout board


## Setting

* Install headless distribution to chip board (optional)
* Connect display and sensor to i2c busses
* Find correct address and bus using i2cdetect and set in lcd/lcd.js file
* Set correct OpenWeatherMap api key, units and query string
* Configure chip to connect to desired wifi automatically
* Set chip ip and credentials in ansible/hosts
* Deploy script using ansible playbook
* Have fun
