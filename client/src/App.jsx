import "./App.css";
import Main from "./views/Main.jsx";

const payIn = 50;
const teamCount = 10;
const payoutConstant = 3.26;

console.log((payIn * teamCount) / payoutConstant);

function App() {
    return <Main />;
}

export default App;

//! Payout Ideas !\\
/*
- Payout Everytime you win
- Knockout Lowest Player Each Week
- 1st, 2nd, Most Points, 1st in Regular Season
- 3rd -> Money Back, 2nd -> 2x Money Back, 1st -> Rest, Weekly 1/3 Payout Hightst Score
-Payout for best QB RB WR TE K DEF
- 12 Teams, $150 Buy In, Champ gets $600 and tranactiob moneym SB loser gets $250
-10 team 100 buck buy in. Winner gets a G, 2nd gets money back, and last place kicks in an extra 100. 
*/

//! Keeper Rules !\\
/*
Our league format is a 3 keeper league, you franchise one player who is 🔒.
Then select 3 more from your roster (you can’t match position with franchise player) and they go into a lottery where 1 is randomly thrown back into the draft.
Can only keep players twice
- Undrafted Free Agents
We decided that they would go for an 8th round pick the first year and then jump 2 rounds every year afte
Our keeper league allows players to be kept in the round they were drafted and then increasing by 3 rounds each consecutive season up to their ADP. 
- no keepers in first 2 rounds
-trade still uses value- fibanacci for keepers
*/
