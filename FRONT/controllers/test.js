const fetch = require("node-fetch");
const LocalStorage = require("node-localstorage").LocalStorage;
let localStorage = new LocalStorage("./storageToken");
require('dotenv').config()



xports.updateRes = async (req, res) => {
    
    fetch("http://localhost:8050/api/reservation/update/?id="+req.query.id, {
      
    // Adding method type
    method: "PUT",
      
    // Adding body or contents to send
    body: JSON.stringify({
        
        
    }),
      
    // Adding headers to the request
    headers: {
        "Content-type": "application/json",
    }
})

.then(response => response.json())
.then(json => console.log(json))

res.redirect('/allRes')
    
}


