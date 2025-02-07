'use strict'

const { consumerToQueue, consumerToQueueSuccessful, consumerToQueueFailed } = require("./src/services/consumerQueue.service")

const queueName = 'test-topic'

// consumerToQueue(queueName).then(() => {
//     console.log(`Message cosumer started ${queueName}`)
// }).catch(() => {
//     console.error(`Error starting message consumer ${queueName}`)
// })


consumerToQueueSuccessful(queueName).then(() => {
    console.log(`Message consumerToQueueSuccessful started ${queueName}`)
}).catch(() => {
    console.error(`Error starting message consumer ${queueName}`)
})

consumerToQueueFailed(queueName).then(() => {
    console.log(`Message consumerToQueueFailed started ${queueName}`)
}).catch(() => {
    console.error(`Error starting message consumer ${queueName}`)
})