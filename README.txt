 __________________________________
|				   |
|          File - README.txt       |
|        Course - COMP 4303        |
|__________________________________|
|				   |
|         GROUP MEMBERS            |
|   James Howse - Steven Sproule   |
| jhowse@mun.ca - sasproule@mun.ca |
|     ????????? - 201918430        |
|__________________________________|

 ______________________________________________________________________________
| DESCRIPTION								       |
|______________________________________________________________________________|
| Our project is a top-down, 2.5D stealth roguelike featuring customisable     |
| procedurally-generated levels, various AI enemies with pathfinding, and a    |
| "hacking" mechanic that allows the player to take control of enemy AIs.      |
|______________________________________________________________________________|

 ______________________________________________________________________________
| HOW TO RUN GAME                                                              |
|______________________________________________________________________________|
| 1. Open a terminal in the /code/ folder (contains index.html).               |
| 2. Run 'npm install three'.						       |
| 3. Run 'npm install three-mesh-ui'.					       |
| 4. Run npx vite.							       |
| 5. Connect to the address shown on the terminal (default: localhost:5173).   |
|______________________________________________________________________________|

 ______________________________________________________________________________
| HOW TO START GAME							       |
|______________________________________________________________________________|
| 1. Click "Start Game" button.						       |
| 2. Wait for level to be generated and load in.			       |
|______________________________________________________________________________|

 ______________________________________________________________________________
| CONTROLS								       |
|______________________________________________________________________________|
|    UP - forwards							       |
|  DOWN - backwards							       |
|  LEFT - steer left							       |
| RIGHT - steer right							       |
|     Z - hack nearby robot or terminal					       |
|     X - attack nearby robot						       |
|     E - reset (self-destruct)						       |
|									       |
| 1,2,3 - cheat key to change level.					       |
|______________________________________________________________________________|

 ______________________________________________________________________________
| TOPICS								       |
|______________________________________________________________________________|
| Complex Movement Algorithms:						       |
|   - Path Following							       |
| Decision Making:							       |
|   - State Machine							       |
| Pathfinding:								       |
|   - Flow Field Pathfinding						       |
| Procedural Content Generation:					       |
|   - Perlin (Simplex) Noise						       |
|   - Depth-First Backtracking Maze Generation				       |
|   - Procedural Dungeon Generation					       |
| Other:								       |
|   - Wander (ROAMbas)							       |
|   - Flocking (goobots)						       |
|______________________________________________________________________________|

 ______________________________________________________________________________
| NOTE									       |
|______________________________________________________________________________|
| A lot of work was put into making a complex, dynamic, and consistent level   |
| generation algorithm. To this end, we implemented a multi-step process that  |
| has highly configurable parameters. It's not as easy to see in-game, so we   |
| included screenshots and video of a zoomed-out "debug view" of the levels    |
| as part of our presentation.						       |
|									       |
| We highly encourage you to turn on the debug visuals and generate a few      |
| maps yourself to see the results! The parameters are readily accessible in   |
| the file /code/mapGeneration/MapParams.js if you want to see how it responds |
| to different settings (which it was built to handle).			       |
|______________________________________________________________________________|

 ______________________________________________________________________________
| HOW TO RUN DEBUG VISUALS						       |
|______________________________________________________________________________|
| 1. Open /???								       |
| 2. Go to line ??? and change the value of const DEBUG to true.               |
| 3. Start the game as before (See: HOW TO PLAY THE GAME).		       |
| 4. Instead of the game, a debug render of the map generation, with a vector  |
|    field to the map's goal, will be displayed. The same controls as in-game  |
|    can be used to move and view different				       |
|______________________________________________________________________________|

 ______________________________________________________________________________
| DISCLAIMER								       |
|______________________________________________________________________________|
| AI was used to generate the UI and the HUD.				       |
|______________________________________________________________________________|