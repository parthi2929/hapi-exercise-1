//1. Import
const Hapi = require('hapi');
var mysql = require('mysql');


//2. Initialize
const server = new Hapi.Server();
var myDBConnection = mysql.createConnection(
    {
        host:       'hapi-mysql-1-parthi2929.cymauzwgfvwy.us-east-2.rds.amazonaws.com',
        user:       'parthi2929',
        password:   'test1234', //ok u got the pw
        port:       '3306',
        database:   'parthiDB'
    }
);

//3. Connect
server.connection(    
    {
        port: process.env.PORT || 8080,
        host: 'localhost'
    }
);
myDBConnection.connect();

//4. Route  (note, unlike express, we first connect and then route, and then start listening)
server.route(
    {
        method: 'GET',
        path: '/',
        handler: (request, reply) =>
        {
            //reply("Hello World");
            //reply.view('index', { name:'Ramasamy' });
            myDBConnection.query(
                'SELECT quote,credit from quotes order by rand() limit 1',
                (error, rows, fields) =>
                {
                    if(error) throw error;

                    reply.view(
                        'index',
                        {
                            quote: rows[0].quote,
                            credit: rows[0].credit
                        }
                    );
                }
            );
        }
    }
);
server.route(
    {
        method: 'GET',
        path: '/users/{username}',
        handler: (request, reply) =>
        {
            reply("Hello " + request.params.username);
        }
    }
);

//4.1 Static routing using inert..
server.register(
    require('inert'),
    (error) =>
    {
        if(error)
        {
            throw error;np
        }
        server.route(
            {
                method: 'GET',
                path: '/about',
                handler: (request, reply) =>
                {
                    reply.file('./public/about.html');
                }
            }
        );
    }
);

//5.1 Dynamic routing via Vision (just registering here, routing could happen elsewhere)
server.register(
    require('vision'),
    (error) =>
    {
        if (error)
        {
            throw error;
        }
        
        server.views(
            {
                engines: 
                {
                    html:require('handlebars')
                },
                path: __dirname + "/views"
            }
        );
    }
);


//5. Start listening
server.start(
    (error) => //we are also getting acquanted with arrow syntax, which has nothing to do with Hapi
    {
        if(error)
        {
            throw error;
        }

        console.log("Catch action at: " + server.info.uri);
    }
);