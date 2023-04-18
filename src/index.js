const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const server = express();
server.use(cors());
server.use(express.json({ limit: '10mb' }));
server.set('view engine', 'ejs');
const pathServerPublicStyles = './src/public-css';
server.use(express.static(pathServerPublicStyles));

const serverPort = process.env.PORT || 4000;
// const serverUrl = process.env.NODE_ENV === 'production' ? 'https://proyectos-molones-team-6.onrender.com' : `http://localhost:${serverPort}`;

//Documentación de API
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger.json');
//Especificar en el server use
server.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));



// Define en qué puerto escucha el servidor de backend las peticiones: 
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:4000`);
});

let connection;

// Crea la "petición" de conexión con la base de datos (freedb):
mysql
  .createConnection({
    host: 'sql.freedb.tech',
    database: 'freedb_projects-team6',
    user: 'freedb_sixonfire',
    password: 'G!mKn4HYfX?@@3Y',
  })
  // Si tiene "permiso" para conectar recibimos el objeto "conn" que usaremos para establecer la conexión:
  .then(conn => {
    connection = conn;
    connection
      .connect()
      .then(() => {
        console.log(`Conexión establecida con la base de datos (identificador=${connection.threadId})`);
      })
      .catch((err) => {
        console.error('Error de conexion: ' + err.stack);
      });
  })
  // Si no tiene "permiso", hemos configurado algo mal: 
  .catch((err) => {
    console.error('Error de configuración: ' + err.stack);
  });

// Definimos un endpoint (/) para poder utilizar con el método GET. Y así en el navegador cuando ponemos http://localhost:4000/ recibimos el mensaje "Hola Adalabers!".
// server.get('/', (req, res) => {
//   res.send("Hola Adalabers!");
// });

// Definimos un endpoint para poder utilizar con el método GET. Y si ponemos en el navegador http://localhost:4000/api/projects/all funciona = no nos da un error 404:
server.get('/api/projects/all', (req, res) => {

  //Guardamos en la variable "sql" un string con una query SQL:
  let sql = 'SELECT * FROM projects, autors WHERE projects.fkAutors = autors.id_autor ';

  connection
    // Usamos la conexión a la base de datos y ejecutamos la query que acabamos de definir:
    .query(sql)

    // Si la ejecución de la query ha funcionado, aquí tendremos la respuesta:
    .then(([results, fields]) => {
      console.log('Información recuperada:');
      results.forEach((result) => {
        console.log(result);
      });

      // Devolvemos el resultado de la query a quien haga la petición:
      res.json({
        success: true,
        projects: results
      });
    })
    // Si no ha ido bien la ejecución de la query, salta un error:
    .catch((err) => {
      throw err;
    });
});

server.post('/api/projects/add', (req, res) => {
  console.log('hola')
  const data = req.body;
  if (data.name === '') {
    res.json({
      success: false,
      error: 'El campo nombre debe estar completo'
    })
  } else if (data.slogan === '') {
    res.json({
      success: false,
      error: 'El campo slogan debe estar completo'
    })
  } else if (data.demo === '') {
    res.json({
      success: false,
      error: 'Completa el campo con la url de tu demo'
    })
  } else if (data.repo === '') {
    res.json({
      success: false,
      error: 'Completa el campo con la url de tu repo'
    })
  } else if (data.technologies === '') {
    res.json({
      success: false,
      error: 'Completa las tecnologías del proyecto'
    })
  } else if (data.desc === '') {
    res.json({
      success: false,
      error: 'Añade una descripción del proyecto'
    })
  } else if (data.image === '') {
    res.json({
      success: false,
      error: 'Añade una imagen del proyecto'
    })
  } else if (data.photo === '') {
    res.json({
      success: false,
      error: 'Añade una foto del autor'
    })
  } else if (data.autor === '') {
    res.json({
      success: false,
      error: 'Completa el nombre del autor '
    })
  } else if (data.job === '') {
    res.json({
      success: false,
      error: 'Indica el trabajo del autor'
    })
  } else {

    let sqlAutor = 'INSERT INTO autors(autor, job) VALUES (? ,?)';

    let valuesAutor = [
      data.autor,
      data.job,
    ];

    connection
      .query(sqlAutor, valuesAutor)
      .then(([results, fields]) => {
        let sqlProject = 'INSERT INTO projects (name, slogan, technologies, demo, repo, `desc`, image, photo, fkAutors) VALUES (? ,?, ?, ? ,?, ?, ? ,?, ?)';
        let valuesProjects = [
          data.name,
          data.slogan,
          data.technologies,
          data.demo,
          data.repo,
          data.desc,
          data.image,
          data.photo,
          results.insertId,
        ];
        connection
          .query(sqlProject, valuesProjects)
          .then(([results, fields]) => {
            let response = {
              'success': true,
              'cardURL': `http://localhost:4000/api/projects/${results.insertId}`,
            }
            res.json(response);
          })
          .catch((err) => {
            throw err;
          });
      });
  }
})

server.get('/api/projects/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  const sql = 'SELECT * FROM projects, autors WHERE projects.fkAutors = autors.id_autor AND id_project = ?';

  connection
    .query(sql, [projectId])
    .then(([results, fields]) => {
      console.log(results[0])
      res.render('project_detail', results[0]);
    })
    .catch((err) => {
      throw err;
    });
})
server.use(express.static('./publish-react'));
