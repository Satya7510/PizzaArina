import axios from 'axios'
import Noty from "noty";
import initAdmin from './admin'
import moment from 'moment'
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


// let adminAreaPath = window.location.pathname
// if (adminAreaPath.includes('admin')) {
//     initAdmin()
// }


//remove alert message after x second
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}



//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')


function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true
    statuses.forEach((status) => {
        let dataprop = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataprop === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })


}

updateStatus(order);



//socket
let socket = io()
// join
if (order) {
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
console.log(adminAreaPath)
if (adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdate', (data) => {
    const updateOrder = { ...order }
    updateOrder.updatedAt = moment().format()
    updateOrder.status = data.status
    updateStatus(updateOrder)
    new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: "Order Updated"
    }).show();
})
