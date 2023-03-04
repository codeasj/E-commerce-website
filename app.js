require('dotenv').config()
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey, stripePublicKey)

const express = require('express')
const app = express()
var path = require('path')
const cors = require('cors')
var fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)
const port = 3000

app.set("view engine", "ejs");
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '/public')));

//Index page
app.get('/', (req,res)=>{
    res.render("index")
})

app.get('/index', (req,res)=>{
    res.render("index")
})

app.get('/shop', (req,res)=>{
    res.render("shop")  
})

app.get('/sproduct', (req,res)=>{
    res.render("sproduct")
})

app.get('/blog', (req,res)=>{
    res.render("blog")
})

app.get('/about', (req,res)=>{
    res.render("about")
})

app.get('/contact', (req,res)=>{
    res.render("contact")
})

app.get('/cart', (req,res)=>{
    fs.readFile("items.json", (error,data) => {
        if (error) {
            res.status(500).end()
        } else {
            res.render("cart", {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})
  
const storeItems = new Map([
    [1, {"name": "Cartoon Astronaut T-Shirts",
    "price": 1499,
    "imgName": "f1.jpg"}],
    [2, {"name": "Cartoon Floral T-Shirts",
    "price": 1299,
    "imgName": "f2.jpg" }],
    [3, {"name": "Cartoon Flower T-Shirts",
    "price": 1699,
    "imgName": "f3.jpg"}],
    [4, {"name": "Cartoon White T-Shirts",
    "price": 1499,
    "imgName": "f4.jpg" }],
    [5, {"name": "Cartoon Rose T-Shirts",
    "price": 1199,
    "imgName": "f5.jpg"}],
    [6, {"name": "Zacket With T-Shirts",
    "price": 999,
    "imgName": "f6.jpg"}],
    [7, {"name": "Grey Floral Pants",
    "price": 3499,
    "imgName": "f7.jpg"}],
    [8, {"name": "Woman Arts T-Shirts",
    "price": 1999,
    "imgName": "f8.jpg"}],
    [9, { "name": "Plain Blue Shirt",
    "price": 1499,
    "imgName": "n1.jpg"}],
    [10, {"name": "Check Grey Shirt",
    "price": 1299,
    "imgName": "n2.jpg"}],
    [11, {"name": "Plain White SweetShirt",
    "price": 1699,
    "imgName": "n3.jpg"}],
    [12, { "name": "Military Half Shirt",
    "price": 1499,
    "imgName": "n4.jpg"}],
    [13, {"name": "Denim FullSleeve Shirt",
    "price": 1199,
    "imgName": "n5.jpg"}],
    [14, {"name": "Grey Pants",
    "price": 999,
    "imgName": "n6.jpg"}],
    [15, { "name": "Khaki FullSleeve Shirt",
    "price": 1349,
    "imgName": "n7.jpg"}],
    [16, {"name": "Black Shirt",
    "price": 1999,
    "imgName": "n8.jpg"}]
  ])
  
  app.post("/create-checkout-session", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.price*100,
            },
            quantity: 1
          }
        }),
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`,
      })
      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
})

app.get('/success', (req,res)=>{
    res.render("success")
})

app.get('/cancel', (req,res)=>{
    res.render("cancel")
})

app.get('*', (req,res) => {
    res.render("404")

})

app.listen(port, () => {
  console.log(`Website listening on http://localhost:${port}`)
})