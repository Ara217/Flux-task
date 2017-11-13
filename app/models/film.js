class Film {
    constructor(connection) {
        this.connection = connection;
    }

    get collection() {
        return 'films';
    }

    get rules() {
        return new this.connection.Schema({
            name: {
                type: String,
                required: 'Name is required!',
                trim: true,
            },
            hall:{
                type: String,
                required: 'Hall is required!',
            },
            price: {
                type: String,
                required: 'Price is required!',
                trim: true
            },
            duration : {
                type: String,
                required:  'Duration is required!'
            },
            time : {
                type: String
            },
            cashiers : [{
                type: String
            }],
            seats : [{
                row: String,
                seat: String
            }]
        });
    }

    get name() {
        return 'ModelFilms';
    }

    get model() {
        return this.connection.model(
            this.name,
            this.rules,
            this.collection
        );
    }
}

module.exports = Film;