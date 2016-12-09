# relay-enzyme
Solving painful headless testing of Relay-produced HOCs

How to
------

1. npm install -D relay-enzyme enzyme
2. Edit your Mocha's setup.js
  1. import RelayEnzyme from 'relay-enzyme'
  2. RelayEnzyme.setup()
