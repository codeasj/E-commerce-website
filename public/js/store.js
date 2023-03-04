if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}   

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('far fa-times-circle')
    for(var i = 0; i < removeCartItem.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('qty') 
    for(var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('fal fa-shopping-cart cart')
    for(var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', (event) => {
            var button = event.target
            var shopItem = button.parentElement.parentElement
            var title = shopItem.getElementsByClassName('des')[0].getElementsByTagName('h5')[0].innerText
            var price = shopItem.getElementsByClassName('des')[0].getElementsByTagName('h4')[0].innerText
            var imageSrc = shopItem.getElementsByTagName('img')[0].src
            var id = shopItem.dataset.itemId
            console.log(title,price,imageSrc)
            addItemToCart(title, price, imageSrc,id)
            updateSubtotal()
        })
    }
     
    //document.getElementsByClassName("purchase")[0].addEventListener('click', purchaseClicked)
}

const button = document.getElementById('checkout')
button.addEventListener("click", () => {
  fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
     body: JSON.stringify({
      items: [
        {
            "id": 1,
            "name": "Cartoon Astronaut T-Shirts",
            "price": 1499,
            "imgName": "f1.jpg"
        },
        {
            "id": 2,
            "name": "Cartoon Floral T-Shirts",
            "price": 1299,
            "imgName": "f2.jpg"
        },
        {
            "id": 3,
            "name": "Cartoon Flower T-Shirts",
            "price": 1699,
            "imgName": "f3.jpg"
        },
        {
            "id": 4,
            "name": "Cartoon White T-Shirts",
            "price": 1499,
            "imgName": "f4.jpg"
        },
        {
            "id": 5,
            "name": "Cartoon Rose T-Shirts",
            "price": 1199,
            "imgName": "f5.jpg"
        },
        {
            "id": 6,
            "name": "Zacket With T-Shirts",
            "price": 999,
            "imgName": "f6.jpg"
        },
        {
            "id": 7,
            "name": "Grey Floral Pants",
            "price": 3499,
            "imgName": "f7.jpg"
        },
        {
            "id": 8,
            "name": "Woman Arts T-Shirts",
            "price": 1999,
            "imgName": "f8.jpg"
        },
        {
            "id": 9,
            "name": "Plain Blue Shirt",
            "price": 1499,
            "imgName": "n1.jpg"
        },
        {
            "id": 10,
            "name": "Check Grey Shirt",
            "price": 1299,
            "imgName": "n2.jpg"
        },
        {
            "id": 11,
            "name": "Plain White SweetShirt",
            "price": 1699,
            "imgName": "n3.jpg"
        },
        {
            "id": 12,
            "name": "Military Half Shirt",
            "price": 1499,
            "imgName": "n4.jpg"
        },
        {
            "id": 13,
            "name": "Denim FullSleeve Shirt",
            "price": 1199,
            "imgName": "n5.jpg"
        },
        {
            "id": 14,
            "name": "Grey Pants",
            "price": 999,
            "imgName": "n6.jpg"
        },
        {
            "id": 15,
            "name": "Khaki FullSleeve Shirt",
            "price": 13499,
            "imgName": "n7.jpg"
        },
        {
            "id": 16,
            "name": "Black Shirt",
            "price": 1999,
            "imgName": "n8.jpg"
        }
      ],
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
    purchaseClicked()
    alert("Press Ok to procees for checkout")
})

function purchaseClicked() {
    var priceElement = document.getElementsByClassName('subtotal')[0]
    var price = parseFloat(priceElement.innerText.replace('₹',''))
    var cartTable = document.getElementsByTagName('tbody')[0]
        while(cartTable.hasChildNodes()) {
            cartTable.removeChild(cartTable.firstChild)
        }
    updateSubtotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.parentElement.remove()
    updateSubtotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <=0) {
    input.value = 1
    }
    updateSubtotal()
}

function addItemToCart(title, price, imageSrc, id) {
    var cartRows = document.createElement('tr')
    var cartTable = document.getElementsByTagName('tbody')[0]
    cartRows.dataset.itemId = id
    var cartItemNames = cartTable.getElementsByClassName('title')
    for (var i = 0; i< cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is a already added to the cart')
            return
        }
    }
    var cartRowContents = `
    <td><a href="#"><i class="far fa-times-circle"></i></a></td>
    <td><img src="${imageSrc}" alt=""></td>
    <td class="title">${title}</td>
    <td class="price">${price}</td>
    <td><input class="qty" type="number" value="1"></td>
    <td class="total">₹1299</td>`
    cartRows.innerHTML = cartRowContents
    cartTable.append(cartRows) 
    console.log(cartTable)
    cartRows.getElementsByClassName('far fa-times-circle')[0].addEventListener('click', removeCartItem) 
    cartRows.getElementsByClassName('qty')[0].addEventListener('change', quantityChanged)
    
}

function updateSubtotal() {
    var cartItemContainer = document.getElementsByTagName("tbody")[0]
    var cartRows = cartItemContainer.getElementsByTagName('tr')
    var total = 0
    for(var i = 0; i < cartRows.length; i++) {
       var cartRow = cartRows[i]
       var priceElement = cartRow.getElementsByClassName('price')[0]
       var quantityElement = cartRow.getElementsByClassName("qty")[0]
       var price = parseFloat(priceElement.innerText.replace('₹',''))
       var quantity = quantityElement.value
       var stotal = price * quantity
       var total = total + stotal
       document.getElementsByClassName('total')[i].innerText = '₹' + stotal
    }
    // total = Math.round(total * 100) / 100 //For float substotals
    document.getElementsByClassName('subtotal')[0].innerText = '₹' + total
}