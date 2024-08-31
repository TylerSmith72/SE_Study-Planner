module.exports = (req, res, next) => {
    const { formData } = req.body;

    if(!formData){
        return res.status(401).json("Incorrect file!");
        console.error(formData);
        console.error(JSON.stringify(formData));
    }
  
    next();
  };