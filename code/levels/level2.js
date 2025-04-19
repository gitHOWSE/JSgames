// levels/leveltwo.js
import BaseLevel from "./baseLevel.js";
import { createForklift } from "../robots/forklift.js";
import { createVacuum } from "../robots/vacuum.js";

export default new BaseLevel(2, createForklift);
