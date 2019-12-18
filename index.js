import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'

import recommends from './db/recommends.json'
import places from './db/places.json'
import languages from './db/languages.json'
import currencies from './db/currencies.json'

const app = express()
const port = 4000

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}

// kayit olan userlarin tutuldugu array
let users = []

app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.send('Welcome to Airbnb API')
})

// json donen api endpointleri
app.get('/api/recommends', (req, res) => {
  res.json(recommends)
})

app.get('/api/places', (req, res) => {
  res.json(places)
})

app.get('/api/languages', (req, res) => {
  res.json(languages)
})

app.get('/api/currencies', (req, res) => {
  res.json(currencies)
})

// req.bodyden gelen user bilgilerini alip password hashlemesinden sonra user arrayine
// pushluyor. basariliysa success responsu donuyor.
app.post('/api/signup', async (req, res) => {
  if (!req.body) return null

  // user varsa hata mesaji
  if (users.find(user => user.email === req.body.email))
    return res.status(401).json({ message: 'Email is already taken.' })

  let user = {
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    password: '',
  }

  await bcrypt.hash(req.body.password, 10).then(response => {
    user.password = response
  })

  users.push(user)

  res.status(200).json({ message: 'success' })
})

// req.body'den gelen user emailine sahip user'i user arrayinden buluyor ve
// passwordun hash'ini gelen passwordun hash'i ile karsilastiriyor. dogru ise
// success responsu donuyor. degilse hata mesaji
app.post('/api/login', async (req, res) => {
  let user = users.find(user => user.email === req.body.email)

  await bcrypt.compare(req.body.password, user.password, (err, results) => {
    if (err) throw new Error(err)

    if (results) return res.status(200).json({ message: 'success' })

    return res.status(401).json({ message: 'error' })
  })
})

app.listen(port, () => console.log(`🚀 Server is up and running on ${port}!`))
