# Milestone Project 2: Breakout

![MS2-breakout-responsiveness](https://github.com/NicoPauwels/Milestone-Project-2-Breakout/blob/master/assets/images/readme/ms2-breakout-responsiveness.png)





You can visit the project [here!](https://nicopauwels.github.io/Milestone-Project-2-Breakout/)<br>My own version of Breakout.<br><br>
The original arcade game was introduced by Atari in 1976.

# UX

## Strategy

We want to create a reconstruction of the original Breakout game. Breakout begins with eight rows of bricks. Using a single ball, the player must destroy as many bricks as possible by using the walls and the paddle below. If the player misses the ball's rebound, he or she will lose a life. In the beginning of the game the player has three lives to clear 10 screens of bricks. Each new level the player has to destroy an additional two rows of bricks. The ball speed increases when the ball hits a brick which has a slightly darker colour. There's a chance that a destroyed brick contains a powerup. The powerup will fall down to the bottom of the screen and if the user is able to catch it with its paddle it will become active. Possible powerups are: an extra life, an extension of the paddle, a superball (destroying all the bricks on its path), a sticky paddle (will make the ball stick to the paddle) and a multiball powerup (two additional balls will be spawned and set course to destroy extra bricks).

#### User stories: 
* I want to play Breakout;
* I want to be able to serve the ball;
* I want to be able to destroy the bricks;
* I want to be able to keep the ball in the game with the paddle;
* I want to be able to see the powerups falling down to the bottom of the screen;
* I want to be able to catch the powerups and experience them in the gameplay;
* I want to know which level I am playing, how many lives I've got left, my current score, my all time high score and whether the sound is on or off.

## Scope / Features

Based on what we have determined in our strategy and taken into account in our user stories, the project should contain a game field with:<br>
* A ball which starts moving as soon as the user has decided to serve it;
* A paddle which can be moved to the left and right and bounces the ball back towards the;
* Eight rows consisting out of fourteen bricks that dissapear when they get hit by a ball;
* There is a chance a destroyed brick contains a powerup, when this is the case, the powerup should start falling to the bottom of the screen;
* When the powerup mentioned above is caught by the paddle, the powerup is activated;
* We want to display the current level, the remaining lives, the score, the high score and info on the sound.

## Structure

With the current scope and features the gamefield will take up the entire screen. At the beginning of the game we display a message box containing the game instructions.

## Skeleton

Below the wireframes:

* Desktop wireframe - [View](https://github.com/NicoPauwels/Milestone-Project-2-Breakout/blob/master/assets/images/readme/wireframe-desktop.png)
* Tablet wireframe - [View](https://github.com/NicoPauwels/Milestone-Project-2-Breakout/blob/master/assets/images/readme/wireframe-tablet.png)
* Mobile wireframe - [View](https://github.com/NicoPauwels/Milestone-Project-2-Breakout/blob/master/assets/images/readme/wireframe-mobile.png)

## Surface

We want this version of Outbreak to have a more modern look than the original version.

* Colour scheme
    * The main colour is #0095DD.

* Typography
    * The main font for text paragraphs is Arial and this is the only font used throughout the project.

# Technologies Used

## Languages used

* [HTML5](https://en.wikipedia.org/wiki/HTML) 
* [CSS3](https://en.wikipedia.org/wiki/CSS)
* [Javascript](https://en.wikipedia.org/wiki/JavaScript)

## Frameworks, Libraries & Programs Used

* [Font Awesome](https://fontawesome.com/start) 
    * Font Awesome was used to import some icons.

* [Git](https://git-scm.com/) 
    * Git was used for version control by utilizing the Gitpod terminal to commit to Git and Push to Github.

* [Github](https://github.com/) 
    * GitHub is used to store the projects code after being pushed from Git.

* [Balsamiq](https://balsamiq.com/) 
    * Balsamiq was used to create the wireframes during the design process.

# The realisation of this project

* [Tutorial 1:](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript)
    I started off the project based on this tutorial, when finalizing this tutorial I wanted to use the gained knowledge to add some powerups, I soon found myself down a rabbithole and I was losing way too much time trying to figure out how to add this powerup functionality to the game. I did manage to hide a few powerups underneath some bricks, and they do fall towards the bottom of the screen. I decided to browse the web to find another tutorial that contained these powerup functionality to see how it is done right and which logic was used. I left the outcome of this excercise in this project in the assets\js folder: index_ver1.js.

* [Tutorial 2:](https://www.youtube.com/c/MtFordStudios/videos)
    As discussed in the previous bulletpoint, a second tutorial was used to gain more insight on how to properly implement powerups into the game. I quickly found myself facing another dilemma: trying to implement the poweruplogic from this tutorial in my already existing javascript code or starting from scratch. I decided to play it safe and start completely based on this tutorial.
    In the end I am sure this was the right thing to do because this tutorial was approaching some things in a complete different way and features that were being built at the end of the project were based on the solid foundation and logic layed out in the beginning.

* My very own feature:
    When I finalized the project based on tutorial 2, I had a severe case of imposter syndrome. I just had to add a feature of my own to the project. I used to play this game at a very young age on my uncles 486. There was a powerup in the version I used to play that was not a part of this version yet: the multiball. I decided to give it a go and by reverse engineering what was happening in the existing code and some sleepless nights later I was able to implement the multiball feature. Although I have deactivated the spinBall() function to get it to work and some bugs might occur when combined with other powerups, I am happy with the outcome for now. It just comes down to fixing these bugs and refactoring the spinBall() function.

# Testing

The W3C Markup Validator, W3C CSS Validator and jshint.com services were used to validate every page of the project to ensure there were no syntax errors in the project.

* [W3C Markup Validator](https://validator.w3.org/) - [Results](https://validator.w3.org/nu/?doc=https%3A%2F%2Fnicopauwels.github.io%2FMilestone-Project-2-Breakout%2F)
* [W3C CSS Validator](https://jigsaw.w3.org/css-validator/) - [Results](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fnicopauwels.github.io%2FMilestone-Project-2-Breakout%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) 
* [jshint.com](https://jshint.com/) - There were some warnings but practically all of them were browser warnings.

## Testing user stories discussed earlier

* I want to play Breakout;
    * User is able to play Breakout.
* I want to be able to serve the ball;
    * User is able to serve the ball by hitting the spacebar or touching the screen on mobile devices.
* I want to be able to destroy the bricks;
    * When a ball hits a brick it dissapears.
* I want to be able to keep the ball in the game with the paddle;
    * When the ball hits the paddle it bounces back as expected.
* I want to be able to see the powerups falling down to the bottom of the screen;
    * When a powerup is to be found under a destroyed brick, it starts falling towards the bottom of the screen.
* I want to be able to catch the powerups and experience them in the gameplay;
    * When a powerup is caught by the paddle, it is activated.
* I want to know which level I am playing, how many lives I've got left, my current score, my all time high score and whether the sound is on or off.
    * The level is being displayed and increases when all bricks have been destroyed, also a new level is being spawned.
    * The lives decrease when a ball is out of bounds, the game ends when all lives are lost and game over is being displayed.
    * The current score is being increased depending on the brick that was destroyed its rank.
    * The all time high score is kept track off by using window.localStorage and thus saves the high score across browser sessions.
    * Also whether the sound is on or off is being displayed.

## Further Testing

* The website was tested on Google Chrome, Mozilla Firefox and Safari browsers.
* The website was viewed on a variety of devices such as desktops, laptops, iPhone 8 and some android devices.
* The website was viewed in google chrome dev tools to check overall responsiveness.
* Friends and family members were asked to review the game to point out any bugs and/or user experience issues.

## Known bugs

* On larger screens of desktops when the browser window is maximized, the ball not always bounces off the paddle but just flies through.
* When multiball has been active and sticky powerup is activated bugs might occur:
    * the balls don't serve correctly or dont serve at all when sticky powerup is active
    * the balls that went out of play suddenly appear back on the canvas


# Deployment

## Github pages

The project was deployed to GitHub Pages using the following steps:

1. Log in to GitHub and locate the [GitHub Repository](https://github.com/NicoPauwels/Milestone-Project-2-Breakout).
2. At the top of the Repository, locate the "Settings" button on the menu.
3. Scroll down the Settings page until you locate the "GitHub Pages" Section.
4. Under "Source", click the dropdown called "None" and select "Master Branch".
5. The page will automatically refresh.
6. Scroll back down through the page to locate the new published site [link](https://nicopauwels.github.io/Milestone-Project-2-Breakout/) in the "Github Pages" section.

# Credits

## Code

### Tutorials
* [Tutorial 1](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript)
* [Tutorial 2](https://www.youtube.com/c/MtFordStudios/videos)
* Various ongoing problems were solved looking for solutions found on [Stackoverflow](https://www.stackoverflow.com) and [W3Schools](https://www.w3schools.com).

## Acknowledgments

* Antonio Rodriguez, my mentor for the continuous support and helpful feedback.
* John Traas, Code Institute alumni, for the continuous support and helpful feedback.
* Sander Van De Wiele for testing the project on his mobile device.