//1. Import
const Hapi = require('hapi');


//2. Initialize
const server = new Hapi.Server();

//3. Connect
server.connection(    
    {
        port: process.env.PORT || 8080,
        host: 'localhost'
    }
);

//4. Route  (note, unlike express, we first connect and then route, and then start listening)
server.route(
    {
        method: 'GET',
        path: '/',
        handler: (request, reply) =>
        {
            //reply("Hello World");
            reply.view('index',
                {
                    name:'Ramasamy'
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