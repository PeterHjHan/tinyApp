function generateRandomString() {
  let string = "";
  const random = "abcdefghijklmnopqrstuv1o238457893475109384172309827234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (let i = 0; i < 6; i++) {
    string += random.charAt(Math.floor(Math.random()*random.length));
  }

  return string;
}

module.exports = {
  generateRandomString,
}