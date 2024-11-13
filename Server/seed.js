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
      21,
      "biobiobioboibobi"
    )
  );
} catch (e) {
  console.log(e);
}
try {
  console.log(
    await usersData.createUser("LeBron", "James", "kingjames", 40, "")
  );
} catch (e) {
  console.log(e);
}
try {
  console.log(
    await usersData.createUser("Aaron", "Rodgers", "arod12", 40, "nyj")
  );
} catch (e) {
  console.log(e);
}
try {
  console.log(
    await usersData.createUser("Aaron", "Judge", "thejudge", 30, "#99")
  );
} catch (e) {
  console.log(e);
}
