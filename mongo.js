const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('make sure you at least give the password');
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://deeppatel1944:${password}@cluster0.uposkjs.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 5){
    const person = new Entry({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log("added " + process.argv[3] + " number " + process.argv[4] + " to phonebook");
        mongoose.connection.close()
    })
}

if (process.argv.length === 3){
    console.log('phonebook:');
    Entry.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + " " + person.number);
        })
        mongoose.connection.close()
    })
}