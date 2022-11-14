const order = require('../../../models/order')

function orderController() {
    return {
        async index(req, res) {
            try {
                await order.find({ status: { $ne: 'completed' } },
                    null, { sort: { 'createdAt': -1 } }).populate
                    ('customerID', '-password').exec((err, orders) => {
                        if (err) {
                            console.log(err.message)
                        }
                        console.log(req.xhr)
                        if (req.xhr) {
                            return res.json(orders)
                        } else {
                            return res.render('admin/orders')
                        }

                    })

            } catch (error) {
                console.log(error.message)
            }

        }
    }
}
module.exports = orderController