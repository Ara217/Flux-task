const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

class UsersController {
    constructor (app) {
        this.application = app;
        this._router = require('express').Router();
        this.bind();
    }

    bind () {
        let that = this;

        passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password'
            },
            function(email, password, done) {
                that.application.models.user.findOne({email: email}, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email.' });
                    }

                    if (user.password !== password) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }

                    return done(null, user);
                });
            }
        ));

        that.bindRoute();
    }

    bindRoute () {
        this.application.app.get('/register', this.getRegister.bind(this));
        this.application.app.post('/register', this.postRegister.bind(this));
        this.application.app.get('/login', this.getLogin.bind(this));
        this.application.app.post('/login', this.postLogin.bind(this));
        this.application.app.get('/logout', this.logout.bind(this));
        this.application.app.get('/', this._ensureAuth, this.index.bind(this));
        this.application.app.get('/list', this._ensureAuth, this.filmsList.bind(this));
        this.application.app.get('/show', this._ensureAuth, this.viewFilm.bind(this));
    }

    getRegister (req, res) {
        res.render('register');
    }

    postRegister (req, res) {
        let body = req.body;

        let formData = {
            name: body.name,
            username: body.username,
            email: body.email,
            password: body.password,
            role: body.role
        };

        let user = new this.application.models.user(formData);

        user.save();

        res.redirect('login');
    }

    getLogin (req, res) {
        res.render('login');
    }

    postLogin (req, res, next) {
        let that = this;
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            };

            if (!user) {
                return res.redirect('/login');
            };

            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });

        })(req, res, next);

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            that.application.models.user.findById(id, function(err, user) {
                done(err, user);
            });
        });
    }

    logout (req, res) {
        req.logOut();
        res.redirect('/login');
    }

    index (req, res) {
        res.render('index', {user: req.user, isAdmin: (req.user.role == 'admin') ? true : false});
    }

    filmsList (req, res) {
        this.application.models.film.find({'cashiers': req.user.id}, function (err, films) {
            res.render('filmsList', {films: films, user:req.user})
        })
    }

    viewFilm (req, res) {
        this.application.models.film.findOne(
            {
                'name': req.query.name,
                'hall' : req.query.hall,
                'time' : req.query.time
            }, function (err, film) {
                res.render('showFilm', {film: film, user: req.user})
            })
    }

    _ensureAuth (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
}

module.exports = UsersController;
