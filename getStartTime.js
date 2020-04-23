//To convert the time in google calendar api format
module.exports =  function getGoogleDate(req){
    var str = []
    str.push(req.body.date)
    str.push('T')
    str.push(req.body.time)
    str.push(':00+05:30')
    str = str.join('')
  
    return str
  }