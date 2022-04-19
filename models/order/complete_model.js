const db = require('../connection_db');

// 確認是否有該訂單
const checkOrderData = (orderID, memberID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID], function (err, rows) {
            if (rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

// 確認訂單是否已完成
const checkOrderComplete = (orderID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT is_complete FROM order_list WHERE order_id = ?', orderID, function (err, rows) {
            if (rows[0].is_complete === 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

// 提取訂單的商品ID
const getOrderData = (orderID, memberID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID], function (err, rows) {
            resolve(rows);
        })
    })
}

// 進行商品的庫存確認
const checkOrderStock = (orderProductID, orderQuantity) => {
    return new Promise((resolve, rejct) => {
        db.query('SELECT * FROM product WHERE id = ?', orderProductID, function (err, rows) {
            if (rows[0].quantity >= orderQuantity && rows[0].quantity !== 0) {
                resolve(true)
            } else {
                resolve(rows[0].name + "庫存不足")
            }
        })
    })
}

module.exports = function orderComplete(orderID, memberID) {
    let result = {};
    return new Promise(async (resolve, reject) => {

        const hasData = await checkOrderData(orderID, memberID);

        const hasComplete = await checkOrderComplete(orderID);

        if (hasData === false) {
            result.status = "訂單完成失敗。"
            result.err = "沒有該訂單資料！"
            reject(result)
        } else if (hasComplete === false) {
            result.status = "訂單完成失敗。"
            result.err = "該訂單已經完成。"
            reject(result)
        } else if (hasData === true && hasComplete === true) {
            // 取得order_list的table資料
            const orderData = await getOrderData(orderID, memberID);

            // 提取商品id
            const productID = orderData[0].product_id;

            // 依序確認訂單中的商品是否有庫存
            for (let key in orderData) {
                const hasStock = await checkOrderStock(orderData[key].product_id, orderData[key].order_quantity);
                if (hasStock !== true) {
                    result.status = "訂單完成失敗。"
                    result.err = hasStock
                    reject(result);
                    return;
                }
            }

            // 將商品庫存扣除
            await db.query('UPDATE product, order_list SET product.quantity = product.quantity - order_list.order_quantity WHERE order_list.product_id = product.id and order_list.order_id = ?;', orderID, function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            // 將is_complete的訂單狀態改為1
            await db.query('UPDATE order_list SET is_complete = 1 WHERE order_id = ?', orderID, function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            result.status = "訂單編號：" + orderID + " 已完成訂購，謝謝您使用該服務！";
            resolve(result);
        }
    })
}
