const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment,
  getReport,
  getReportDocx,
  createShareLink,
  getSharedReport,
  heartbeat,
  goOffline,
  getPresence
} = require('../controllers/workboardController');
const {
  listArtboards,
  createArtboard,
  getArtboard,
  updateArtboard,
  deleteArtboard,
  createNote,
  updateNote,
  deleteNote,
  createArtboardShare,
  getSharedArtboard,
  createSharedNote,
  updateSharedNote,
  deleteSharedNote
} = require('../controllers/artboardController');
const { authenticateToken, authorizeAdminOrSuperior } = require('../middleware/auth');

router.get('/share/:token', getSharedReport);

// Public artboard share (token grants collaborative edit)
router.get('/artboards/share/:token', getSharedArtboard);
router.post('/artboards/share/:token/notes', createSharedNote);
router.patch('/artboards/share/:token/notes/:noteId', updateSharedNote);
router.delete('/artboards/share/:token/notes/:noteId', deleteSharedNote);

router.use(authenticateToken, authorizeAdminOrSuperior);

router.get('/workers', getWorkers);
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.patch('/tasks/:id/status', updateTaskStatus);
router.delete('/tasks/:id', deleteTask);
router.post('/tasks/:id/comments', addComment);
router.get('/report/docx', getReportDocx);
router.get('/report', getReport);
router.post('/report/share', createShareLink);
router.post('/presence/heartbeat', heartbeat);
router.post('/presence/offline', goOffline);
router.get('/presence', getPresence);

router.get('/artboards', listArtboards);
router.post('/artboards', createArtboard);
router.post('/artboards/:id/share', createArtboardShare);
router.get('/artboards/:id', getArtboard);
router.patch('/artboards/:id', updateArtboard);
router.delete('/artboards/:id', deleteArtboard);
router.post('/artboards/:id/notes', createNote);
router.patch('/artboards/:id/notes/:noteId', updateNote);
router.delete('/artboards/:id/notes/:noteId', deleteNote);

module.exports = router;
