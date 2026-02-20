function errorHandler(err, req, res, next){
    console.log(" API Error:", err)

    if(err.name === 'CastError'){
        return res.status(400).json({error:"Invalid ID format"})
    }

    res.status(500).json({error:"Server Error"})
}

module.exports = errorHandler;