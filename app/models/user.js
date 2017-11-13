class User {
    constructor(connection) {
        this.connection = connection;
    }

    get collection() {
        return 'users';
    }

    get rules() {
        return new this.connection.Schema({
            email: {
                type: String,
                required: 'Email is required!',
                unique: true,
                trim: true,
            },
            username:{
                type: String,
                unique: true
            },
            password: {
                type: String,
                required: 'Password is required!',
                trim: true
            },
            role: {
              type: String
            }
        });
    }

    get name() {
        return 'ModelUsers';
    }

    get model() {
        return this.connection.model(
            this.name,
            this.rules,
            this.collection
        );
    }
}

module.exports = User;