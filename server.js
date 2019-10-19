const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let requestCount = 0;

function checkProjectInArray(req, res, next) {
  const id = req.params.id;
  const project = projects.find(p => p.id == id);
  if (!project) return res.json({message: "Project does not exists"});
  req.project = project;

  return next();
}

function logRequest(req, res, next) {
  requestCount++;
  console.log("Request: " + requestCount);
  return next();
}

server.use(logRequest);

server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
})

server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const title = req.body.title;

  req.project.title = title;

  return res.json(req.project);
})

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const index = projects.findIndex(p => p.id == req.project.id);

  projects.splice(index, 1);

  return res.json();
})

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const title = req.body.title;

  req.project.tasks.push(title);

  return res.json(req.project);
})

server.listen(3000)