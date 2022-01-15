var dotenv = require('dotenv').config(),
    faunadb = require('faunadb'),
    bcrypt = require('bcrypt'),
    q = faunadb.query;
    jwt = require('jsonwebtoken');
 
let Client = new faunadb.Client({ 
    secret: process.env.FAUNA_KEY,
    domain: "db.eu.fauna.com"
});
exports.createUser = async (req, res) => {
  let { email, username, password, confirm_password } = req.body

  //console.log(Client)

    if(password !== confirm_password) {
        return res.status(400).send({
            status: 'failed',
            message: 'Passwords do not match'
        })
    }
  password = bcrypt.hashSync(password, bcrypt.genSaltSync());
  let data
  try {
    data= await Client.query(   
      q.Create(
        q.Collection('Users'),
        {
          data: {email, username, password, isVerified: false}
        }
      )
    )

    if (data.username === 'BadRequest') {
        return res.status(400).send({
            status: 'failed',
            message: 'Invalid'
        })
    } 

    const user = data.data
    user.id = data.ref.value.id
    let token = jwt.sign(user, process.env.SECRET, {expiresIn: 600});

    return res.status(201).send({
        status: 'success',
        message: { user: user, access_token: token }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

exports.loginUser = async (req, res) => {
    let { email, password } = req.body
 try {
  let userData = await Client.query(
    q.Get(  
      q.Match(q.Index('user_by_email'), email.trim()),
    )
  )
  
  userData.data.id = userData.ref.value.id
  if (bcrypt.compareSync(password, userData.data.password)) {
    let token = jwt.sign(userData.data, process.env.SECRET, {expiresIn: 600});

    return res.status(201).send({
        status: 'success',
        message: { user: userData.data, access_token: token }
    })
  }
  else {
      return res.status(401).send({
          status: 'failed',
          message: 'Invalid Password'
      })
  }
 } catch (error) {
   return res.status(500).send(error)
 }
}