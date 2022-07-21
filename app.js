//importa el modulo express completo
const express = require('express')
const app = express()
//importamos la libreria cors
const  cors = require('cors');
app.use(cors()); 
//le decimos al programa que debe ejecutarse en formato json
app.use(express.json())
//definimos un puerto
const port = 5000


//generamos arrays 
const todos = [{idTutorial:1, nombreTutorial:'Constitucion',tipoTutorial:"Abogacia",url:"https://www.congreso.gob.ar/constitucionNacional.php", activo:false},
                {idTutorial:2, nombreTutorial:'Balance Hidrico',tipoTutorial:"Enfermeria",url:"https://es.wikipedia.org/wiki/Balance_h%C3%ADdrico", activo:false},
                {idTutorial:3, nombreTutorial:'Ingles Basico',tipoTutorial:"Profesorado de Ingles",url:"https://www.u-cursos.cl/usuario/c19094b1ea89f1f08e243796b671e2e5/mi_blog/r/1_Augusto_Ghio_Ingles_basico.pdf", activo:false}
            ]

//le decimos desde que url va a ejecutarse nuestro programa. le colocamos el nombre y dos parametros req y res
app.get('/tutoriales', (req,res) => {
    console.log("Llego solicitud de tutoriales")
    res.status(200).json(todos)
    })

    //en la solicitud respondemos el id de la tarea. Devolvemos una unica tarea / objeto
    app.get('/tutoriales/:id', (req,res) => {
        //tenemos el id de tareas
        const idTarea = req.params.id

        //buscamos una tarea en un array con el metodo fine
        const tarea = todos.find(t => t.id == idTarea)
        // si existe la tarea devuelvo el codigo 200, sino no existe devuelvo el codigo 404. No se encontro el recurso
        if(undefined != tarea)
            res.status(200).json(tarea)
        else
            res.status(404).json({mensaje: `el tutorial ${idTarea} no fue encontrada`})        
        })

        //post genera un nuevo registro y tiene que saber que informacion esta enviando
        app.post('/tutoriales', (req, res)=> {
            const cuerpo = req.body
            const ids = todos.map(t => t.idTutorial)
            //agregar un objeto al final
            const max = ids.length > 0 ? Math.max( ...ids) + 1 : 1
            todos.push ( {"idTutorial": max, "nombreTutorial": cuerpo.nombreTutorial, "tipoTutorial": cuerpo.tipoTutorial, 
                            "url": cuerpo.url , "activo":cuerpo.activo })
            //devuelvo el codigo mas el objeto recien creado con el id
            res.status(201).json(todos[todos.length - 1])
        })

        // Borrar una tarea en particular por su id
        app.delete('/tutoriales/:id', (req,res) => {
            //tenemos el id de tareas
            const idTarea = req.params.id
            //buscamos una tarea en un array con el metodo fine
            const tarea = todos.find(t => t.idTutorial == idTarea)
            if(undefined != tarea){
                //devuelve en que indice se encuentra la tarea que encontre
                const idx = todos.indexOf(tarea)
                //le decimos que apartir de ese indice de array borra ese elemento
                todos.splice(idx,1)
                res.status(200).json({mensaje: `El tutorial ${idTarea} fue eliminado`, "tarea":tarea})
            }
            //si no encontramos la tarea que queremos borrar
            else 
            res.status(404).json({mensaje: `El tutorial ${idTarea} no fue encontrado`})

        })

        //modificar un elemento del array a partir del id
        app.put('/tutoriales/:id/activar', (req,res) => {
            //tenemos el id de tareas
            const idTarea = req.params.id
            //buscamos una tarea en un array con el metodo fine
            const tarea = todos.find(t => t.idTutorial == idTarea)
            if(undefined != tarea){
                //devuelve en que indice se encuentra la tarea que encontre
                const idx = todos.indexOf(tarea)
                //si encuentro la tarea
                tarea.activo = true
                //borra el elemento que quiero cambiar y completa en su lugar lo que quiero modificar
                todos.splice(idx,1,tarea)
                res.status(200).json({mensaje: `El tutorial ${idTarea} fue activado `, "tarea": tarea})
            }
            //si no encontramos la tarea que queremos borrar
            else 
            res.status(404).json({mensaje: `El tutorial ${idTarea} no fue encontrado`})

        })
//ponemos nuestra aplicacion a correr. por le decimos en que puerto debe escuchar y luego un mensaje
app.listen(port, () => {
    console.log(`Aplicación iniciada en el puerto: ${port}`)
})