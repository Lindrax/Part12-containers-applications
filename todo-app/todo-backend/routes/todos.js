const express = require('express');
const { Todo } = require('../mongo');
const { setAsync, getAsync } = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})

  res.send(todos);
});

//get stats
router.get('/statistics', async (_, res) => {
  const n = await getAsync("added_todos")
  n != null 
  ?   
  res.json({
    "added_todos": n
  })
  :
  res.json({
    "added_todos": 0
  })
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  console.log(req.body)
  const n = await getAsync("added_todos")
  const updated = await setAsync("added_todos", n != null ? parseInt(n) + 1 : 1);

  console.log(updated)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  console.log(text)
  console.log(done)

  try {
    req.todo.text = text
    req.todo.done = Boolean(done) 

    const updatedTodo = await req.todo.save()
    res.json(updatedTodo)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
