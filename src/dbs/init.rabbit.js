'use strict';

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        if (!connection) {
            throw new Error('Connection not established')
        }

        const channel = await connection.createChannel()

        return { channel, connection }
    } catch (error) {

    }
}

const connectToRabbitMQTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ()

        // Publish message to a queue
        const queue = 'test-queue'
        const message = 'Hello, shop by anhtudo'

        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        // close the connection
        await connection.close()
    } catch (error) {
        console.error('Error when try to connect to RabbitMQ', error)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true })
        console.log(`Waiting for messages ...`)
        channel.consume(queueName, msg => {
            console.log(`Received messages:  ${queueName}::`, msg.content.toString())
            // 1. find User following that shop
            // 2. send message to user
            // 3. ok =>> successful
            // 4. error =>> setup DLX 
        })
    } catch (error) {
        console.error('Error publish message to rabbitMQ::', error)
        throw new Error(`Error publish message to rabbitMQ:: ${error}`)
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQTest,
    consumerQueue
}