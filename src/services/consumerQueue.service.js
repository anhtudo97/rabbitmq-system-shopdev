'use strict'

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit")

// const log = console.log
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const messageService = {
    consumerToQueue: async queueName => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`Error consumer to queue`, error)
        }
    },
    // case prcessing
    consumerToQueueSuccessful: async queueName => {
        try {
            const { channel, connection } = await connectToRabbitMQ()

            const notificationQueue = 'notificationQueueProcess' // queue main process

            // 1, TTL
            // const timeToExpired = 15000
            // setTimeout(() => {
            //     channel.consume(notificationQueue, msg => {
            //         console.log(`SENDING ${notificationQueue} successfully processed: ${msg.content.toString()}`)
            //         channel.ack(msg)
            //     })
            // }, timeToExpired);

            // 2, LOGIC
            channel.consume(notificationQueue, msg => {

                try {
                    const n = Math.random()
                    console.log({ n });
                    if (n < 0.8) {
                        throw new Error(`Send notification failed: ${notificationQueue}:: HOT FIX`);
                    }

                    console.log(`SENDING ${notificationQueue} successfully processed: ${msg.content.toString()}`)
                    channel.ack(msg)
                } catch (error) {
                    // console.error(`Error consumer to queue`, error)
                    /*
                        nack: negative acknowledgement
                    */
                    channel.nack(msg, false, false)
                }

            })

        } catch (error) {
            console.error(`Error consumer to queue`, error)
        }
        // case successful processing
    },
    // case failed processing
    consumerToQueueFailed: async queueName => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            const notificationExchangeDLX = 'notificationExchangeDLX' // exchange for DLX - dead letter exchange
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // routing key for DLX     

            const noticationQueueHandler = 'notificationQueueHandlerHOTFIX'

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            const queue = await channel.assertQueue(noticationQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queue.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queue.queue, msgFailed => {
                console.log(`This notification error was: ${msgFailed.content.toString()}`)
            }, {
                noAck: true
            })

        } catch (error) {
            console.error(`Error consumer failed to queue`, error)
        }
        // case successful processing
    }
}

module.exports = messageService