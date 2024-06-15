let message = {
    noDataMessage: "No result found",
    errorMessage: "Something Went Wrong",
    catchMessage: "Internal Server Error !",
  };
  
  function response( successBool, message, dataValue=[]) {
    return {
      success: successBool,
      msg: message,
      data: dataValue 
    }
  } 
  
  module.exports = {message, response};
    