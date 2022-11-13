import axios from 'axios'
import Noty from "noty";
import initAdmin from './admin'
let addToCart = document.querySelectorAll('.add-to-cart')

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: "success",
            timeout: 1000,
            progressBar: false,
            text: "Item added to cart"
        }).show();

    }).catch(err => {
        new Noty({
            type: "error",
            timeout: 1000,
            progressBar: false,
            text: "Somthing went wrong"
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', e => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })

})


let adminAreaPath = window.location.pathname
if (adminAreaPath.includes('admin')) {
    initAdmin()
}


//remove alert message after x second
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}
