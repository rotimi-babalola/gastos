import express from 'express';
import graphqlHTTP from 'express-graphql';
import expenseSchema from './schemas/index';
import connect from './db';
import appConfig from './config';
import setUpMiddWare from './middleware';
import router from './routes';


const app = express();

/* eslint no-unused-vars: 0*/
/* eslint no-console: 0*/

app.use('/graphql', graphqlHTTP(req => ({
  schema: expenseSchema,
  graphiql: true,
})));

// mount middleware
setUpMiddWare(app);
// connect to DB
connect();

app.use(router);

const port = appConfig.port || 3000;

app.listen(port, () => console.log(`App running on port ${port}`));

export default app;
