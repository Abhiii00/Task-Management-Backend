exports.registerValidation = async (req, res, next) => {
  try {
    const data = req.body;
    let errorMsg = "";
    switch (true) {
      case Object.keys(data).length === 0:
        errorMsg = "You Have Not Entered Any Data";
        break;
      case !data.name:
        errorMsg = "Name is required";
        break;
      case !data.email:
        errorMsg = "Email is required";
        break;
      case !data.password:
        errorMsg = "Password is required";
        break;
      case !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+~]).{8,}/.test(
        data.password
      ):
        errorMsg =
          "Password Should Contain 8 Characters, 1 Lowercase, 1 Uppercase, 1 Numeric, and 1 Special Character";
        break;
    }
    if (errorMsg === "") {
      next();
    } else {
      return res.status(200).send({ success: false, msg: errorMsg });
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: err.message });
  }
};


exports.loginValidation = async (req, res, next) => {
    try {
      const data = req.body;
      let errorMsg = "";
      switch (true) {
        case Object.keys(data).length === 0:
          errorMsg = "You Have Not Entered Any Data";
          break;
        case !data.email:
          errorMsg = "Email is required";
          break;
        case !data.password:
          errorMsg = "Password is required";
          break;
      }
      if (errorMsg === "") {
        next();
      } else {
        return res.status(200).send({ success: false, msg: errorMsg });
      }
    } catch (err) {
      return res.status(500).send({ success: false, msg: err.message });
    }
  };
  
  exports.taskValidation = async (req, res, next) => {
    try {
      const data = req.body;
      let errorMsg = "";
      switch (true) {
        case Object.keys(data).length === 0:
          errorMsg = "You Have Not Entered Any Data";
          break;
        case !data.title:
          errorMsg = "Title is required";
          break;
        case !data.description:
          errorMsg = "Description is required";
          break;
          case !data.date:
          errorMsg = "Date is required";
          break;
          case !data.priority:
          errorMsg = "Priority is required";
          break;
      }
      if (errorMsg === "") {
        next();
      } else {
        return res.status(200).send({ success: false, msg: errorMsg });
      }
    } catch (err) {
      return res.status(500).send({ success: false, msg: err.message });
    }
  };