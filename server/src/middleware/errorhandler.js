function errorHandler(err, req, res, next){
    console.log(" API Error:", err)

    //Mongoose invalid objectID often triggers CastError
    if(err.name === 'CastError'){
        return res.status(400).json({error:"Invalid ID format"})
    }
    //If there are any other specific instances of error that you can accout for
    //Implement them here like the one above

    res.status(500).json({error:"Server Error"})
}

module.exports = errorHandler;