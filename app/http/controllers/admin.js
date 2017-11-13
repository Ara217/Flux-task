const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');

class UsersController {
    constructor (app) {
        this.application = app;
        this._router = require('express').Router();
        this.bind();
    }

    bind () {
        this.bindRoute();
    }

    bindRoute () {
        this.application.app.get('/create', this._ensureAuth, this.getManageFilm.bind(this));
        this.application.app.post('/addSession', this._ensureAuth, this.postManageFilm.bind(this));
    }

    getManageFilm (req, res, next) {
        this.application.models.user.find({ 'role': 'cashier' }, function (err, cashier) {
            if (err) return next(err);

            res.render('addFilms', {cashier : cashier, user: req.user})
        });
    }

    postManageFilm (req, res) {
        let that = this;
        let body = req.body;

        let formData = {
            time: body.time,
            duration: body.duration,
            hall: body.hall,
            name: body.name,
            price: body.price,
            cashiers : body['cashiers[]'],
        };
        this.application.models.film.findOne({'time': body.time, 'hall' : body.hall }, function(err, film) {
            if (!film) {
                let film = new that.application.models.film(formData);

                film.save();

                res.redirect('/')
            }
        });
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