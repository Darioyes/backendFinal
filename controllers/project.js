'use strict'

var Project = require('../models/project'); //modelo en donde esta el moldelo de project

var controller = {

    home: function(req, res){
        return res.status(200).send({
            message: "Soy la home"
        });
    },

    test: function(req, res){
        return res.status(200).send({
            message: "soy el metodo o accion test del controlador de project"
        });
    },

    saveProject: function(req, res){
        var project = new Project(); //creamos un objeto de tipo project

        var params = req.body; //recogemos los parametros que nos llegan por post
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        //guardamos el objeto en la base de datos
        project.save()
            .then((projectStored) => {
            res.status(200).send({project: projectStored});
            })
            .catch((err) => {
            res.status(500).send({message: "Error al guardar el documento: " + err.message});
            });
    },

    getProject: async function(req, res) {

        //comprobamos si nos llega un id por la url
        var projectId = req.params.id;
        if (projectId == null) {
            return res.status(404).send({ message: "El proyecto no tiene referencia" });
        }

        try {
            const projectId = req.params.id;
            if (!projectId) {
                return res.status(404).send({ message: "El proyecto no existe" });
            }
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).send({ message: "El proyecto no existe" });
            }
            return res.status(200).send({ project });
        } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Error al devolver los datos" });
        }
    }
    

};

module.exports = controller;