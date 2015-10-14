# Coding Exercise for Front-End Developer candidates

## Introduction

This exercise will help the hiring team at Spredfast gauge your level of front-end coding experience (HTML, CSS & JavaScript).

Please budget about two hours of actual coding time to complete the project. We realize that's a tight constraint, but we'd like to be respectful of your time while still allowing you to produce enough code for us to make a fair assessment of your skills. Try to ensure that the finished product represents your coding abilities. You are not necessarily expected to fully finish within the time limit. We'd much rather review high-quality, incomplete work than rushed, completed work. Be prepared to explain your thinking and how your development process lead to your solution.

We've created a few starter files that you should flesh out:

* [index.html](index.html)
* [style.css](css/style.css)
* [script.js](js/script.js)

and a [PSD](Leaderboard.psd) to use as a mockup.

## Requirements

You will build a "Hardcore Produce" leaderboard, which is a list of the top five hardcore fruit & veggie names paired with the number of times that they have been mentioned on Twitter or Facebook.

For simplicity's sake, we've stubbed out an API interface within a library (see [api.js](js/api.js)). The library provides a `Poller()` class with a `.poll()` method. This method will poll for the top names of the type of produce requested in each poll ('fruits' or 'veggies').

Your task is to use the poll method to implement a solution that handles multiple asynchronous responses to build the "Hardcore Produce" leaderboard. The leaderboard that you build should satisfy these basic requirements:

* Visually adhere to the provided [PSD](Leaderboard.psd).
* Every 15 seconds, update the leaderboard to show the latest produce names and counts, sorted descending by count.
* The resulting leaderboard should be a mix of both fruits and veggies.
* **Bonus:** Animate the leaderboard update in some way (fade/dissolve, sliding, etc.).
* **Bonus:** Make the leaderboard a responsive design that displays nicely on smaller screens.

When you're finished, please send your work to your Spredfast dev contact as a .zip file or (preferably) a link to a public repo on GitHub.

## Questions?

Please use your best judgment to interpret the requirements above. However, if you're stuck with questions, feel free to email your Spredfast dev contact. There are no bad questions (other than, "What does JavaScript mean?").
