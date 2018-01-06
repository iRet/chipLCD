"use strict";

var five   = require('johnny-five')
  , chipio = require('chip-io')
  , usage  = require('usage')
  , pid    = process.pid
  , temp   = 0
  , date = undefined
  , delimiter = ':'
  , request = require('request')
  , lcd
  , counter = 0
  , position = 0
  , strings = []
  , buffer = ''
  , weather = { temp: 0, humidity: 0, wind: 0 }
  , i2c_htu21d = require('htu21d-i2c')
  , htu21df;

// Openweather credentials
var ow_appid = '730dda275db9b54f27866d5228092056'
  , ow_q     = 'Krasnoyarsk,RU'
  , ow_units = 'metric';

var ow_endpoint =
  'http://api.openweathermap.org/data/2.5/weather?' +
  'q=' + q +
  '&appid=' + appid +
  '&units=' + units;


// Johnny-five initialization
var board = new five.Board({
  io: new chipio(),
  repl: false
});

board.on('ready', function() {
  // Set correct sensor address here
  htu21df = new i2c_htu21d({'device': '/dev/i2c-1'});

  // Set correct LCD address here
  lcd = new five.LCD({controller: "PCF8574A", address: 0x3f, bus: 2})

  // Add custom degree symbol
  lcd.createChar('degree', [6,9,9,6,0,0,0]);
  lcd.useChar('degree');
  lcd.useChar('clock');
});

board.loop(1000, function(){
  date = new Date();

  lcd.cursor(0,0);
  lcd.print((weather.temp + '  ').substr(0,3));
  lcd.print(':degree:');
  lcd.print('C');
  lcd.cursor(0,5);
  lcd.print((' ' + weather.wind).substr(-2) + ' m/s');

  lcd.cursor(0,12);
  lcd.print(((' ' + weather.humidity).substr(-2) + ' %' + '  ').substr(0,4));

  // Clock
  lcd.cursor(1,5);
  lcd.print(':clock:');
  lcd.print(('0' + date.getHours()).substr(-2));
  lcd.print(delimiter);
  lcd.print(('0' + date.getMinutes()).substr(-2));

  if (delimiter == ':') { delimiter = ' ' } else { delimiter = ':' }

  // Temperature update
  htu21df.readTemperature(function (temp) {
    lcd.cursor(1,0);
    lcd.print((temp + '    ').substr(0,4));

    htu21df.readHumidity(function (humidity) {
      lcd.cursor(1,12);
        lcd.print((humidity +  '    ').substr(0,4));
      });
    });
});


// Weather update
board.loop(30000, function(){
  request(ow_endpoint, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      weather = {
        temp:     json.main.temp.toFixed(),
        humidity: json.main.humidity.toFixed(),
        wind:     json.wind.speed.toFixed()
      }
    }
  });
});
