const crypto = require('crypto');
const Artboard = require('../models/Artboard');
const ArtboardNote = require('../models/ArtboardNote');
const ArtboardShare = require('../models/ArtboardShare');
const { NOTE_COLORS } = require('../models/ArtboardNote');
const { emitArtboardEvent } = require('../realtime/artboardSocket');

const DEFAULT_NOTE_SIZE = { width: 176, height: 140 };
const STARTER_NOTE = { x: 280, y: 180, color: 'yellow', text: '', zIndex: 1 };
const SHARE_PATH_PREFIX = '/admin/workboard/artboard/share';

const canUseArtboard = (user) =>
  user && (user.role === 'admin' || user.role === 'superior');

const findOwnedArtboard = async (artboardId, userId) =>
  Artboard.findOne({ _id: artboardId, owner: userId });

const isShareExpired = (share) =>
  Boolean(share?.expiresAt && share.expiresAt.getTime() < Date.now());

const findValidShareByToken = async (token) => {
  const share = await ArtboardShare.findOne({ token });
  if (!share) return { error: { status: 404, message: 'Share link not found' } };
  if (isShareExpired(share)) {
    return { error: { status: 410, message: 'Share link has expired' } };
  }
  return { share };
};

const nextColor = (usedColors = []) => {
  const counts = Object.fromEntries(NOTE_COLORS.map((c) => [c, 0]));
  usedColors.forEach((color) => {
    if (counts[color] !== undefined) counts[color] += 1;
  });
  return NOTE_COLORS.reduce((best, color) =>
    counts[color] < counts[best] ? color : best
  );
};

const serializeNote = (note) => ({
  id: note._id,
  text: note.text || '',
  color: note.color,
  x: note.x,
  y: note.y,
  zIndex: note.zIndex || 1,
  updatedAt: note.updatedAt,
  createdAt: note.createdAt
});

const serializeBoard = (board, notes = []) => ({
  id: board._id,
  title: board.title,
  createdAt: board.createdAt,
  updatedAt: board.updatedAt,
  notes: notes.map(serializeNote)
});

const clientSocketId = (req) => {
  const raw = req.get('x-socket-id') || req.body?.socketId || '';
  return String(raw || '').trim() || undefined;
};

const buildShareUrl = (req, token) => {
  const frontend = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
  const path = `${SHARE_PATH_PREFIX}/${token}`;
  if (frontend) return `${frontend}${path}`;
  const origin = `${req.protocol}://${req.get('host')}`;
  return `${origin}${path}`;
};

const createNoteOnBoard = async (board, body = {}) => {
  const existing = await ArtboardNote.find({ artboard: board._id }).select('color x y zIndex');
  const color =
    NOTE_COLORS.includes(body.color) ? body.color : nextColor(existing.map((n) => n.color));

  const maxZ = existing.reduce((max, note) => Math.max(max, note.zIndex || 1), 0);
  const last = existing[existing.length - 1];
  const offset = 28 + (existing.length % 5) * 12;

  const x =
    typeof body.x === 'number' ? body.x : (last?.x ?? STARTER_NOTE.x) + offset;
  const y =
    typeof body.y === 'number' ? body.y : (last?.y ?? STARTER_NOTE.y) + offset;

  const note = await ArtboardNote.create({
    artboard: board._id,
    text: String(body.text || '').trim().slice(0, 500),
    color,
    x,
    y,
    zIndex: maxZ + 1
  });

  board.updatedAt = new Date();
  await board.save();

  return note;
};

const applyNotePatch = (note, body = {}) => {
  if (body.text !== undefined) {
    note.text = String(body.text || '').trim().slice(0, 500);
  }
  if (NOTE_COLORS.includes(body.color)) {
    note.color = body.color;
  }
  if (typeof body.x === 'number' && Number.isFinite(body.x)) {
    note.x = body.x;
  }
  if (typeof body.y === 'number' && Number.isFinite(body.y)) {
    note.y = body.y;
  }
  if (typeof body.zIndex === 'number' && Number.isFinite(body.zIndex)) {
    note.zIndex = body.zIndex;
  }
};

const listArtboards = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const boards = await Artboard.find({ owner: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt');

    res.json({
      artboards: boards.map((board) => ({
        id: board._id,
        title: board.title,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt
      }))
    });
  } catch (error) {
    console.error('List artboards error:', error);
    res.status(500).json({ message: 'Failed to list artboards' });
  }
};

const createArtboard = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const title = String(req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (title.length > 120) {
      return res.status(400).json({ message: 'Title is too long' });
    }

    const board = await Artboard.create({
      owner: req.user._id,
      title
    });

    const note = await ArtboardNote.create({
      artboard: board._id,
      ...STARTER_NOTE
    });

    res.status(201).json({
      artboard: serializeBoard(board, [note]),
      noteSize: DEFAULT_NOTE_SIZE
    });
  } catch (error) {
    console.error('Create artboard error:', error);
    res.status(500).json({ message: 'Failed to create artboard' });
  }
};

const getArtboard = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const board = await findOwnedArtboard(req.params.id, req.user._id);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const notes = await ArtboardNote.find({ artboard: board._id }).sort({
      zIndex: 1,
      createdAt: 1
    });

    res.json({
      artboard: serializeBoard(board, notes),
      noteSize: DEFAULT_NOTE_SIZE
    });
  } catch (error) {
    console.error('Get artboard error:', error);
    res.status(500).json({ message: 'Failed to load artboard' });
  }
};

const updateArtboard = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const board = await findOwnedArtboard(req.params.id, req.user._id);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    if (req.body.title !== undefined) {
      const title = String(req.body.title || '').trim();
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      if (title.length > 120) {
        return res.status(400).json({ message: 'Title is too long' });
      }
      board.title = title;
    }

    await board.save();

    emitArtboardEvent(
      board._id,
      'artboard:title',
      { artboardId: String(board._id), title: board.title },
      clientSocketId(req)
    );

    res.json({
      artboard: {
        id: board._id,
        title: board.title,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt
      }
    });
  } catch (error) {
    console.error('Update artboard error:', error);
    res.status(500).json({ message: 'Failed to update artboard' });
  }
};

const deleteArtboard = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const board = await findOwnedArtboard(req.params.id, req.user._id);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    await ArtboardNote.deleteMany({ artboard: board._id });
    await ArtboardShare.deleteMany({ artboard: board._id });
    await board.deleteOne();

    emitArtboardEvent(board._id, 'artboard:deleted', {
      artboardId: String(board._id)
    });

    res.json({ message: 'Artboard deleted' });
  } catch (error) {
    console.error('Delete artboard error:', error);
    res.status(500).json({ message: 'Failed to delete artboard' });
  }
};

const createNote = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const board = await findOwnedArtboard(req.params.id, req.user._id);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const note = await createNoteOnBoard(board, req.body);
    const serialized = serializeNote(note);

    emitArtboardEvent(
      board._id,
      'artboard:note:created',
      { artboardId: String(board._id), note: serialized },
      clientSocketId(req)
    );

    res.status(201).json({ note: serialized });
  } catch (error) {
    console.error('Create artboard note error:', error);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

const updateNote = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const board = await findOwnedArtboard(req.params.id, req.user._id);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const note = await ArtboardNote.findOne({
      _id: req.params.noteId,
      artboard: board._id
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    applyNotePatch(note, req.body);
    await note.save();
    board.updatedAt = new Date();
    await board.save();

    const serialized = serializeNote(note);
    emitArtboardEvent(
      board._id,
      'artboard:note:updated',
      { artboardId: String(board._id), note: serialized },
      clientSocketId(req)
    );

    res.json({ note: serialized });
  } catch (error) {
    console.error('Update artboard note error:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

const deleteNote = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const board = await findOwnedArtboard(req.params.id, req.user._id);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const note = await ArtboardNote.findOneAndDelete({
      _id: req.params.noteId,
      artboard: board._id
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    board.updatedAt = new Date();
    await board.save();

    emitArtboardEvent(
      board._id,
      'artboard:note:deleted',
      { artboardId: String(board._id), noteId: String(note._id) },
      clientSocketId(req)
    );

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete artboard note error:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};

const createArtboardShare = async (req, res) => {
  try {
    if (!canUseArtboard(req.user)) {
      return res.status(403).json({ message: 'Artboard access required' });
    }

    const board = await findOwnedArtboard(req.params.id, req.user._id);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    let share = await ArtboardShare.findOne({
      artboard: board._id,
      createdBy: req.user._id,
      permission: 'edit',
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
    }).sort({ createdAt: -1 });

    let created = false;
    if (!share) {
      share = await ArtboardShare.create({
        token: crypto.randomBytes(24).toString('hex'),
        artboard: board._id,
        createdBy: req.user._id,
        permission: 'edit',
        expiresAt: null
      });
      created = true;
    }

    const path = `${SHARE_PATH_PREFIX}/${share.token}`;
    res.status(created ? 201 : 200).json({
      token: share.token,
      path,
      url: buildShareUrl(req, share.token),
      permission: share.permission,
      artboardId: String(board._id)
    });
  } catch (error) {
    console.error('Create artboard share error:', error);
    res.status(500).json({ message: 'Failed to create share link' });
  }
};

const getSharedArtboard = async (req, res) => {
  try {
    const { share, error } = await findValidShareByToken(req.params.token);
    if (error) return res.status(error.status).json({ message: error.message });

    const board = await Artboard.findById(share.artboard);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const notes = await ArtboardNote.find({ artboard: board._id }).sort({
      zIndex: 1,
      createdAt: 1
    });

    res.json({
      artboard: serializeBoard(board, notes),
      noteSize: DEFAULT_NOTE_SIZE,
      permission: share.permission,
      shareToken: share.token,
      collaborative: true
    });
  } catch (error) {
    console.error('Get shared artboard error:', error);
    res.status(500).json({ message: 'Failed to load shared artboard' });
  }
};

const createSharedNote = async (req, res) => {
  try {
    const { share, error } = await findValidShareByToken(req.params.token);
    if (error) return res.status(error.status).json({ message: error.message });
    if (share.permission !== 'edit') {
      return res.status(403).json({ message: 'Edit access required' });
    }

    const board = await Artboard.findById(share.artboard);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const note = await createNoteOnBoard(board, req.body);
    const serialized = serializeNote(note);

    emitArtboardEvent(
      board._id,
      'artboard:note:created',
      { artboardId: String(board._id), note: serialized },
      clientSocketId(req)
    );

    res.status(201).json({ note: serialized });
  } catch (error) {
    console.error('Create shared artboard note error:', error);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

const updateSharedNote = async (req, res) => {
  try {
    const { share, error } = await findValidShareByToken(req.params.token);
    if (error) return res.status(error.status).json({ message: error.message });
    if (share.permission !== 'edit') {
      return res.status(403).json({ message: 'Edit access required' });
    }

    const board = await Artboard.findById(share.artboard);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const note = await ArtboardNote.findOne({
      _id: req.params.noteId,
      artboard: board._id
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    applyNotePatch(note, req.body);
    await note.save();
    board.updatedAt = new Date();
    await board.save();

    const serialized = serializeNote(note);
    emitArtboardEvent(
      board._id,
      'artboard:note:updated',
      { artboardId: String(board._id), note: serialized },
      clientSocketId(req)
    );

    res.json({ note: serialized });
  } catch (error) {
    console.error('Update shared artboard note error:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

const deleteSharedNote = async (req, res) => {
  try {
    const { share, error } = await findValidShareByToken(req.params.token);
    if (error) return res.status(error.status).json({ message: error.message });
    if (share.permission !== 'edit') {
      return res.status(403).json({ message: 'Edit access required' });
    }

    const board = await Artboard.findById(share.artboard);
    if (!board) {
      return res.status(404).json({ message: 'Artboard not found' });
    }

    const note = await ArtboardNote.findOneAndDelete({
      _id: req.params.noteId,
      artboard: board._id
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    board.updatedAt = new Date();
    await board.save();

    emitArtboardEvent(
      board._id,
      'artboard:note:deleted',
      { artboardId: String(board._id), noteId: String(note._id) },
      clientSocketId(req)
    );

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete shared artboard note error:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};

module.exports = {
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
};
