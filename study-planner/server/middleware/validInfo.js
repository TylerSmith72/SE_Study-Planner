module.exports = (req, res, next) => {
  const { username, firstname, surname, email, password, repeatpass } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    // console.log(email.length); -- REMOVE 
    if (![username, firstname, surname, email, password, repeatpass].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } 
    else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    } 
    else if (password != repeatpass) {
      return res.status(401).json("Password doent't match");
    }
  } 
  else if (req.path === "/login") {
    if (![username, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } 
    /*else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }   -- REMOVE*/
  }

  next();
};