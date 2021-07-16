## CIS 557 Final Project

The CIS 557 Final Project for team A.B.E (Ajay Patel, Blien Habtu, Emile Givental) with TA Satyarth Vaidya. The project is built in Node.js / Express with a React frontend. The database used is MongoDB, which is hosted on Mongo Atlas.

## Accessing the Cloud Hosted Version

The cloud hosted version of the project is deployed to Heroku and can be found here: [https://abe-557.herokuapp.com/](https://abe-557.herokuapp.com/)

## Project Wiki

The [wiki](https://github.com/cis557/project-microblogging-and-streaming-social-network-team16/wiki) contains more information about everything related to the project and documentation for the API, frontend, design, etc.

## Travis CI

[![Build Status](https://travis-ci.com/cis557/project-microblogging-and-streaming-social-network-team16.svg?token=CfdCxWGXswza3tGrvF5k&branch=master)](https://travis-ci.com/cis557/project-microblogging-and-streaming-social-network-team16)

Travis CI is our CI solution that lints, runs tests, and measures code coverage. It also is our CD solution that deploys to Heroku.

---------------

## Setup Instructions

These instructions only need to be done **once** just to get your computer setup. For Mac or Linux only.

**Step One**: Install [n](https://github.com/tj/n), which helps manage and install different version of Node.js and NPM on your computer. (only needs to be done once). You can install it by running: `curl -L https://git.io/n-install | bash` in your Terminal.

**Step Two**: In Terminal, run `n 14.15.4` (this will install Node.js version 14.15.4).


**Step Three**: Change directory in your Terminal to wherever the project is after cloning it with Git. `cd /wherever/the/path/to/this/project/is/on/your/computer/`.

**Step Four**: Run `npm install --global yarn` and then run `yarn install`.

## Development Instructions

These instructions you will follow **every time** you want to work on the project.

**Step One**: Change directory in your Terminal to wherever the project is after cloning it with Git. `cd /wherever/the/path/to/this/project/is/on/your/computer/`.

**Step Two**: Run `yarn development`. This will start the Express-based API backend server and the ReactJS web frontend. Keep this terminal window open! If you close it, everything will stop running.
  * You can access the web frontend at `http://localhost:3000` on your computer. 
  * You can access the backend API server at `http://localhost:3001` on your computer. 

**Step Three**: Edit the code! The ReactJS and web frontend's files are located in the `src` folder. The backend Express API server is located in the `server` folder.

**Step Four**: Just refresh your browser to see the updates. `yarn development` will automatically look for any changes you made and rebuild the project. _No need to continually go through Steps 1-3 everytime you edit the code._

**Step Five**: In the terminal window in which you ran `yarn development`, keep a lookout for any errors and warnings. You'll see that each line starts with `[ExpressAPIServer]` or `[React]` or `[Linting]` or `[CSSValidator]` to help you figure out where the error or warning is coming from.

## Running Tests and Linting Locally

The Travis CI/CD system will run tests and lint the code before it allows you to merge a pull request to the main branch or deploy to the cloud hosted version.

* **Run React Tests:** Run inside the project folder: `yarn reacttest`
* **Run APIServer Tests:** Run inside the project folder: `yarn apitest`
* **Run Linting:** Run inside the project folder: `yarn lint` and also you can use `yarn lint --fix` to ask the system to auto-fix some types of simple mistakes.
    * You must conform to the [Airbnb JavaScript Guidelines](https://github.com/airbnb/javascript).
    * You must add [JSDoc comments](https://devhints.io/jsdoc) to any JavaScript functions created.
* **Run CSS Validation:** Run inside the project folder: `yarn css`
    * Your CSS must be validated by the [W3C CSS Validation Service](http://www.css-validator.org/).