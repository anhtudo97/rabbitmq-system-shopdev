'use strict'

// const { describe } = require("jest")
const { connectToRabbitMQTest } = require("../dbs/init.rabbit")

const mongoose = require('mongoose')
const connectionString = 'mongodb://localhost:27017/test'

const TestSchema = new mongoose.Schema({ name: String })
const Test = mongoose.model('Test', TestSchema)

describe('Mongoose connection', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(connectionString)
    })

    // close the connection to mongoose
    afterAll(async () => {
        await connection.disconnect()
    })

    it('shoule connect to successful Mongoose', async () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should have user in database', async () => {
        const user = await Test.findOne({ name: 'tuanh' })

        expect(user).toBeDefined()
        expect(user.name).toBe('tuanh')
    })
})