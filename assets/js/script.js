/* Example of import that goes with the 2nd example below.
import {busScheduleViewFunction} from "./view/organisms/busScheduleView.js";
*/

/* Eksempel af kodning til appens container til forskellige sektioner (klassenavne er ikke endelige) */

const infoboardRootByMariePierreLessard = document.getElementById("app");
infoboardRoot.classList("infoboard-grid-by-Marie-Pierre-Lessard");

const columnOneByMariePierreLessard = Div();
columnOneByMariePierreLessard.classList("left-infoboard-column-by-Marie-Pierre-Lessard");

const columnTwoByMariePierreLessard = Div();
columnTwoByMariePierreLessard.classList("right-infoboard-column-by-Marie-Pierre-Lessard");
const columnTwoLeftByMariePierreLessard = Div();
columnTwoLeftByMariePierreLessard.classList("left-side-of-column-two-by-Marie-Pierre-Lessard");
const columnTwoRightByMariePierreLessard = Div();
columnTwoRightByMariePierreLessard.classList("right-side-of-column-two-by-Marie-Pierre-Lessard");
columnTwoByMariePierreLessard.append(columnTwoLeftByMariePierreLessard, columnTwoRightByMariePierreLessard);

infoboardRoot.append(columnOneByMariePierreLessard, columnTwoByMariePierreLessard);

/* TO DO: 
append sections to relevant column 

For eksempel:

const busScheduleByMalte = busScheduleViewFunction(argument1, argument2);
busScheduleByMalte.classList("global-styling-for-coloured-lines-by-Marie-Pierre-Lessard span-element-styling-by-Malte");
columnOneByMariePierreLessard.append(busScheduleByMalte(argument1, argument2));

*/

/* TO DO 
create obligatory top-level elements:
- global header (contains invisible text or has min height)
- global footer (contains TechCollege logo) */






