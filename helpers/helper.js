const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');
const moment = require('moment');
const dateformat = require('dateformat');
const fs = require('fs');
const db = require('../models/db');

const helper = {
    sanitize: function (query) {
        return sanitize(query);
    },

    renameAvatar: function (req, newName) {
        var origName = req.files['picture'][0].originalname;
        var extension = origName.substring(origName.lastIndexOf('.'));
        const newURL =
            req.files['picture'][0].destination + '/' + newName + extension;

        fs.renameSync(req.files['picture'][0].path, newURL);
        return newName + extension;
    },

    renameCredentials: function (req, newName) {
        var origName = req.files['credentials'][0].originalname;
        var extension = origName.substring(origName.lastIndexOf('.'));
        const newURL =
            req.files['credentials'][0].destination + '/' + newName + extension;

        fs.renameSync(req.files['credentials'][0].path, newURL);
        return newName + extension;
    },

    formatDate: function (date) {
        var diff_seconds = Math.round((+new Date() - date) / 1000);

        var minute = 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

        var time;

        if (diff_seconds < 30) {
            time = 'just now';
        } else if (diff_seconds < minute) {
            time = diff_seconds + ' seconds ago';
        } else if (diff_seconds < 2 * minute) {
            time = 'a minute ago';
        } else if (diff_seconds < hour) {
            time = Math.floor(diff_seconds / minute) + ' minutes ago';
        } else if (Math.floor(diff_seconds / hour) == 1) {
            time = '1 hour ago';
        } else if (diff_seconds < day) {
            time = Math.floor(diff_seconds / hour) + ' hours ago';
        } else if (diff_seconds == day) {
            time = 'yesterday';
        } else if (diff_seconds < day * 7){
            var temp = Math.floor(diff_seconds / day);

            if (temp == 1){
                time = '1 day ago'
            } else{
                time = Math.floor(diff_seconds / day) + ' days ago';
            }
        } else if (diff_seconds == week) {
            time = '1 week ago'; 
        } else if (diff_seconds == week * 2){
        	time = '2 weeks ago'; 
		} else if (diff_seconds == week * 3){
        	time = '3 weeks ago'; 
		} else if (diff_seconds == week * 4){
        	time = '1 month ago'; 
		} else if ((diff_seconds > week) && (diff_seconds < week * 2)) {
			time = 'more than a week ago' 
        } else if ((diff_seconds > week) && (diff_seconds < week * 4)) {
			time = 'more than ' + Math.floor(diff_seconds / week) + ' weeks ago' 
        } else {
            time = 'on ' + dateformat(date, 'mmm dd, yyyy');
        }

        return time;
    },

    getDate: function(date) {
        var d = date.getDate()
        var m = date.getMonth()+1
        var month

        switch(m) {
            case 1:
                month = "January"
                break
            case 2:
                month = "February"
                break
            case 3:
                month = "March"
                break
            case 4:
                month = "April"
                break
            case 5:
                month = "May"
                break
            case 6:
                month = "June"
                break
            case 7:
                month = "July"
                break
            case 8:
                month = "August"
                break
            case 9:
                month = "September"
                break
            case 10:
                month = "October"
                break
            case 11:
                month = "November"
                break
            case 12:
                month = "December"
                break
        }
        return month + " " + d
    },

    getTime: function(date) {
        currentHours = date.getHours()
        currentHours = ('0' + currentHours).slice(-2)

        currentMinutes = date.getMinutes()
        currentMinutes = ('0' + currentMinutes).slice(-2)

        return currentHours + ':' + currentMinutes
    },

    parseDate: function (s) {
        if (!moment(s, 'YYYY-MM-DD', true).isValid()) {
            return null;
        }

        if (s == null || s === undefined) {
            return null;
        }

        var b = s.split(/\D/);
        let date = new Date(b[0], --b[1], b[2]);

        date.setHours(8, 0, 0, 0);

        return date;
    }
};

module.exports = helper;
