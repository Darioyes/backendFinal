'use strict'

var Project = require('../models/project'); //modelo en donde esta el moldelo de project
var fs = require('fs'); //libreria para trabajar con el sistema de ficheros

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
    },
    
    getProjects: function(req, res) {
        Project.find({}).sort('-year').exec()
            .then(projects => {
                if (!projects) {
                return res.status(404).send({message: "No hay proyectos para mostrar"});
                }
                return res.status(200).send({projects});
        })
        .catch(err => {
            return res.status(500).send({message: "Error al devolver los datos"});
        });
    },

    updateProject: function(req, res){
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update).then((projectUpdated) => {
            if (!projectUpdated) {
                return res.status(404).send({message: "No existe el proyecto para actualizar"});
            }

            return res.status(200).send({project: projectUpdated});
        }).catch((err) => {
            return res.status(500).send({message: "Error al actualizar: " + err});
        });
    },

    deleteProject: async function(req, res) {
        try {
            const projectId = req.params.id;
        
            const projectRemoved = await Project.findByIdAndRemove(projectId);
            if (!projectRemoved) {
                return res.status(404).send({message: "No existe el proyecto para eliminar"});
            }
    
            return res.status(200).send({project: projectRemoved});
        } catch (error) {
            return res.status(500).send({message: "Error al eliminar: " + error});
        }
    },

    uploadImage: function(req, res) {
        var projectId = req.params.id;
        var fileName = "Imagen no subida...";
        if (req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'|| fileExt == 'JPG') {
                
                Project.findByIdAndUpdate(projectId, {image: fileName}).then((projectUpdated) => {
                    
                    if (!projectUpdated) {
                        return res.status(404).send({message: "No existe el proyecto para actualizar"});
                    }
                    return res.status(200).send({project: projectUpdated});
    
                }).catch((err) => {
                    return res.status(500).send({message: "Error al actualizar: " + err});
                });

            }else{
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({message: "La extensión no es válida"});
                });
            }
            

            
        }else{
            return res.status(200).send({
                message: fileName
            });
        }
    }



};

module.exports = controller;