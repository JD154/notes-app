const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated,  (req, res) => {
  res.render('notes/add-note');
});

router.post('/notes/add', isAuthenticated, async (req, res) => {
  const {title, content} = req.body;
  const errors = [];

  if (!title){
    errors.push({text: "Please enter a title"});  
  }

  if (!content){
    errors.push({text: "Please enter content"});    
  }

  if (errors.length > 0){
    res.render('notes/add-note', {
      errors,
      title,
      content
    });
  }else {
    const newNote = Note({title, content});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note created sucessfully!');
    res.redirect('/notes');
  }
});

router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
  res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const editNote = await Note.findById(req.params.id)
  res.render('notes/edit-note', {
    editNote
  });
});

router.put("/notes/edit-note/:id", isAuthenticated, async (req, res) => {
  const {title, content} = req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, content});
  req.flash('success_msg', 'Note updated sucessfully!');

  res.redirect("/notes");
});

router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);
  req.flash('success_msg', 'Note deleted sucessfully!');
  res.redirect("/notes");
});

module.exports = router;