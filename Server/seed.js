import * as usersData from "./data/users.js";

console.log("SEEDING DATABASE");

/* for (let i = 1; i < 10; i++) {
  try {
    console.log(await usersData.create());
  } catch (e) {
    console.log(e);
  }
}
 */

try {
  console.log(
    await usersData.createUser(
      "Zack",
      "Rimshnick",
      "zrimmy",
      "zrimshnick@gmail.com",
      21,
      "biobiobioboibobi"
    )
  );
} catch (e) {
  console.log(e);
}
try {
  console.log(
    await usersData.createUser(
      "LeBron",
      "James",
      "kingjames",
      "l.james6@gmail.com",
      40,
      ""
    )
  );
} catch (e) {
  console.log(e);
}
try {
  console.log(
    await usersData.createUser(
      "Aaron",
      "Rodgers",
      "arod12",
      "aaron.r12@gmail.com",
      40,
      "nyj"
    )
  );
} catch (e) {
  console.log(e);
}
try {
  console.log(
    await usersData.createUser(
      "Aaron",
      "Judge",
      "thejudge",
      "aaron.judge@yahoo.com",
      30,
      "#99"
    )
  );
} catch (e) {
  console.log(e);
}
