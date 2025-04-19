// levels/leveltwo.js
import BaseLevel from "./baseLevel.js";
import { createForklift } from "../robots/forklift.js";
import { createVacuum } from "../robots/vacuum.js";
import { createDrone } from "../robots/drone.js";

export default new BaseLevel(1, createDrone);
