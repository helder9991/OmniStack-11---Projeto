const axios = require('axios');
const parseStringAsArray = require('../utils/parseStringAsArray');
const Dev = require('../models/Dev');


module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
        
        let dev = Dev.findOne({ github_username });

        if(dev)
            return res.status(400).json('User already exists');

        const response = await axios.get(`https://api.github.com/users/${github_username}`);
    
        const { name = login, avatar_url, bio } = response.data;
    
        const techsArray = parseStringAsArray(techs);
            
        const location = {
            type: 'Point',
            coordinates: [latitude, longitude]
        }
    
        dev = await Dev.create({
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
        })
    
        res.json(dev);
    }

}