const WorkshopEvent = require('../models/WorkshopEvent');
const { userHasPremiumAccess } = require('../utils/premiumAccess');

const WORKSHOP_SLUG = 'build-with-ai-workshop';

const defaultWorkshopEvent = () => ({
  slug: WORKSHOP_SLUG,
  title: 'Build with AI Weekend Workshop',
  description:
    'A live 2-day workshop for book buyers. We build together using the same MERN stack and Cursor workflow from the book.',
  timezone: 'Africa/Lagos',
  recordingsUrl: '',
  sessions: [
    {
      sessionId: 'day-1',
      title: 'Day 1 — Foundations & First Build',
      description:
        'Website structure, MERN mindset, toolkit setup, and your first browser-ready project.',
      startsAt: new Date('2026-09-05T19:00:00.000Z'),
      joinUrl: ''
    },
    {
      sessionId: 'day-2',
      title: 'Day 2 — Full Stack & Deploy',
      description:
        'Connect frontend to backend, follow the data flow, and deploy your project live.',
      startsAt: new Date('2026-09-06T19:00:00.000Z'),
      joinUrl: ''
    }
  ]
});

const serializeWorkshopEvent = (event) => ({
  slug: event.slug,
  title: event.title,
  description: event.description,
  timezone: event.timezone,
  recordingsUrl: event.recordingsUrl || '',
  sessions: (event.sessions || []).map((session) => ({
    sessionId: session.sessionId,
    title: session.title,
    description: session.description,
    startsAt: session.startsAt,
    joinUrl: session.joinUrl || ''
  })),
  updatedAt: event.updatedAt
});

const getOrCreateWorkshopEvent = async () => {
  let event = await WorkshopEvent.findOne({ slug: WORKSHOP_SLUG });

  if (!event) {
    event = await WorkshopEvent.create(defaultWorkshopEvent());
  }

  return event;
};

const getWorkshopEvent = async (req, res) => {
  try {
    const hasAccess = await userHasPremiumAccess(req.user);
    if (!hasAccess) {
      return res.status(403).json({
        message: 'Premium access required. Purchase a book to unlock the workshop event page.'
      });
    }

    const event = await getOrCreateWorkshopEvent();
    res.json({ event: serializeWorkshopEvent(event) });
  } catch (error) {
    console.error('Get workshop event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminWorkshopEvent = async (req, res) => {
  try {
    const event = await getOrCreateWorkshopEvent();
    res.json({ event: serializeWorkshopEvent(event) });
  } catch (error) {
    console.error('Get admin workshop event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAdminWorkshopEvent = async (req, res) => {
  try {
    const { title, description, timezone, recordingsUrl, sessions } = req.body;
    const event = await getOrCreateWorkshopEvent();

    if (title != null) {
      event.title = String(title).trim();
    }

    if (description != null) {
      event.description = String(description).trim();
    }

    if (timezone != null) {
      event.timezone = String(timezone).trim() || 'Africa/Lagos';
    }

    if (recordingsUrl != null) {
      event.recordingsUrl = String(recordingsUrl).trim();
    }

    if (Array.isArray(sessions)) {
      event.sessions = sessions.map((session) => {
        const existing = event.sessions.find(
          (entry) => entry.sessionId === session.sessionId
        );

        return {
          sessionId: session.sessionId || existing?.sessionId,
          title: session.title != null ? String(session.title).trim() : existing?.title || '',
          description:
            session.description != null
              ? String(session.description).trim()
              : existing?.description || '',
          startsAt: session.startsAt ? new Date(session.startsAt) : existing?.startsAt,
          joinUrl:
            session.joinUrl != null
              ? String(session.joinUrl).trim()
              : existing?.joinUrl || ''
        };
      });
    }

    await event.save();
    res.json({
      message: 'Workshop event updated successfully',
      event: serializeWorkshopEvent(event)
    });
  } catch (error) {
    console.error('Update admin workshop event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWorkshopEvent,
  getAdminWorkshopEvent,
  updateAdminWorkshopEvent
};
