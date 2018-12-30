# Slot Machine Game

This is a Slot Machine Game for the Casumo coding challenge.

## Decisions along the way

- Dependencies: First decision was choosing what game library to use. I thought it would be a great idea to not use any library and rely only on the canvas API. This proved to be great for me because I had to focus on creating my own framework to work with (I called it Cheddar). But it meant that had to do everything. I only used webpack and babel dependencies.

- Organization: I had to choose how to organize my code, and I thought it would be a good idea to organize my code in classes, since I've worked with phaser and it was a good framework reference.

- What to focus: When I started i had to create classes and methods when I needed it. The organization that I had made this an easy task, since I knew always where my methods where. I focused on graphics, and the most difficult part was how to make the symbols aligned when they were inside the payline grid. This was because in the "wheel of fortune", as everything rotates at the same time, there's an angle between every symbol and they didn't align to the grid. Eventually I realized I had to make each ring move independently. Next I focused on the odds of each symbol to appear. Last I focused on sound, which I didn't really had the time to make it perfect.

- What I didn't focus on:
  1. First and most important thing I didn't focus on was on performance. Firstly I wanted to implement a variable called "isDirty" so the rendering was done only for objects that were changed. Then I wanted to create a layering system so I didn't have to clear the whole canvas every frame and redraw everything (for example, create multiple canvas on top of each other). In fact, I tried the game in two mobile phones, in an iPhone 6 the speed was good but the game flickered constantly. In an iPhone X, the game was so slow that it was impossible to play. On chrome in a computer it works pretty well.
  2. User experience and the point system. I started the project with this in mind as you could create multiple scenes and render them one on top of the other. 
  3. Graphics where other thing that I didn't really focus on. I started with a spritesheet and that's the one I finished the project with. 
  4. Frame independent movement. I set the whole thing up, but the frame delta from the requestAnimationFrame was sometimes 0.1 seconds and sometimes more than 2 seconds, which messed up the whole animations.
  5. Documentation: I commented the methods but I would like to document the whole framework.
  6. Testing: This would have saved me a lot of time
  
- What I would do again: I would have chosen a good performant framework that worked on WebGL as well as canvas. But I learned a lot and I'm happy with the result.

## How to play!
first, run `npm i`

then run `npm start`

or you could click [here](https://musing-lovelace-2a82fd.netlify.com/) and start playing right away!

## How long it took
I took this challenge 13 days ago but this challenge took 8 days since Christmas was on the way. Sometimes I worked 4 hours on it, sometimes 8 hours. I'd say that I worked a total of 40hs

## The End
Thank you for reading!

more from me: 

[GitHub](https://github.com/RodriFS/)

[LinkedIn](https://www.linkedin.com/in/rodrigo-f-sanchez/)
