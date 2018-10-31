const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Connection to Database
mongoose.connect("mongodb://localhost/graphql", { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))

const Course = require("./models/Courses")

// GraphQL schema
const schema = buildSchema(`
  type Query {
    course(id: String!): Course
    courses(topic: String): [Course]
  },
  type Course {
    _id: String
    title: String
    author: String
    description: String
    topic: String
    url: String
  },
  type Mutation {
    updateCourse(id: String!, title: String, author: String, description: String): Course
    insertCourse(title: String!, author: String, description: String): Course
  }
`);

//Todo: Handle Errors from Database and async with try catch

const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

const getCourse = async ({id}) => { 
  return prepare(await Course.findOne({_id: id}))
}

const getCourses = async ({topic}) => {
  if (topic) {
    return await Course.find({topic});
  } else {
    return await Course.find({})
  }
}

const updateCourse = async ({id, title, author, description, topic, url}) => {
  let data = {};
  if(title){
    data.title = title;
  }
  if(author){
    data.author = author;
  }
  if(description){
    data.description = description;
  }
  if(topic){
    data.topic = topic;
  }
  if(url){
    data.url = url;
  }
  const res = await Course.findOneAndUpdate(
    ObjectId(id),
    { $set:data }
  )
  return prepare(await Course.findOne({_id: id}))
}

const insertCourse = async ({title, author, description, topic, url}) => {
  const course = new Course({_id: new ObjectId(), title, author, description, topic, url})  
  const res = await course.save();
  return prepare(await Course.findOne({_id: res._id}))
}

const root = {
  course: getCourse,
  courses: getCourses,
  updateCourse: updateCourse,
  insertCourse: insertCourse
};

// Create an express server and a GraphQL endpoint
const app = express();

app.set('view engine', 'ejs');

app.use('/courses', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));