const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Courses = require("./database")

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
  return prepare(await Courses.findOne({_id: id}))
}

const getCourses = async ({topic}) => {
  if (topic) {
    return await Courses.find({topic});
  } else {
    return await Courses.find({})
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
  const res = await Courses.findOneAndUpdate(
    ObjectId(id),
    { $set:data }
  )
  return prepare(await Courses.findOne({_id: id}))
}

const insertCourse = async ({title, author, description, topic, url}) => {
  const course = new Courses({_id: new ObjectId(), title, author, description, topic, url})  
  const res = await course.save();
  return prepare(await Courses.findOne({_id: res._id}))
}

const root = {
  course: getCourse,
  courses: getCourses,
  updateCourse: updateCourse,
  insertCourse: insertCourse
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));