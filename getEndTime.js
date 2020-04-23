//To get the dateTime and convert the it in google calendar api format
module.exports = function getGoogleDate(req){
    var str = []
    str.push(req.body.Edate)
    str.push('T')
    str.push(req.body.Etime)
    str.push(':00+05:30')
    str = str.join('')
    
      return str
    }