/* Example of import that goes with the 2nd example below.
import {busScheduleViewFunction} from "./view/organisms/busScheduleView.js";
*/

/* Eksempel af kodning til appens container til forskellige sektioner (klassenavne er ikke endelige) */

const infoboardRootByMariePierreLessard = document.getElementById("app");
infoboardRoot.classList("infoboard-grid-by-Marie-Pierre-Lessard");

const columnOneByMariePierreLessard = Div();
columnOneByMariePierreLessard.classList("left-infoboard-column-by-Marie-Pierre-Lessard");
const columnTwoByMariePierreLessard = Div();
columnTwoByMariePierreLessard.classList("central-infoboard-column-by-Marie-Pierre-Lessard");
const columnThreeByMariePierreLessard = Div();
columnThreeByMariePierreLessard.classList("right-infoboard-column-by-Marie-Pierre-Lessard");

infoboardRoot.append(columnOneByMariePierreLessard, columnTwoByMariePierreLessard, columnThreeByMariePierreLessard);

/* TO DO: 
append sections to relevant column 

For eksempel:

const busScheduleByMalte = busScheduleViewFunction(argument1, argument2);
busScheduleByMalte.classList("global-styling-for-coloured-lines-by-Marie-Pierre-Lessard span-element-styling-by-Malte");
columnOneByMariePierreLessard.append(busScheduleByMalte(argument1, argument2));

*/






