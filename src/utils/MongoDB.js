const mongoose = require('mongoose');
const config = require('../../config.json')

module.exports = async () => {
    await mongoose.connect(config.database.mongoURL, config.database.options)
        .then(x => {
            console.log(
                `[MongoDB]: Connected`,
            );
            console.log(
                `Database name: "${x.connections[0].name}"`,
            );
        })
        .catch(err => {
            console.error('[MongoDB]: Error\n', err);
        });
    return mongoose;
};