const adminAuthentication = (req, res, next) => {
    if (!req.session.admin) return res.redirect("/");
    next();
  };
  
  module.exports = adminAuthentication;
  