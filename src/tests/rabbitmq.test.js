'use strict'

// const { describe } = require("jest")
const { connectToRabbitMQTest } = require("../dbs/init.rabbit")

describe('RabbitMQ connection', () => {
    it('shoule connect to successful RabbitMQ', async () => {
        const result = await connectToRabbitMQTest()
        expect(result).toBeUndefined()
    })
})