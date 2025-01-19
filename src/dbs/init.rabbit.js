'use strict';

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
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

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQTest
}