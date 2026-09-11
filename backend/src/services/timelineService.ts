interface TimelineEntry {
  id: string;
  userId: string;
  type: 'symptom' | 'lab' | 'note' | 'medication';
  title: string;
  description: string;
  severity?: 'low' | 'moderate' | 'high';
  createdAt: Date;
}

interface CreateTimelineEntryData {
  type: 'symptom' | 'lab' | 'note' | 'medication';
  title: string;
  description: string;
  severity?: 'low' | 'moderate' | 'high';
}

export class TimelineService {
  async getTimeline(userId: string, options: { limit: number; offset: number }): Promise<TimelineEntry[]> {
    // TODO: Fetch from database
    // const result = await db.query(
    //   'SELECT * FROM timeline_entries WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    //   [userId, options.limit, options.offset]
    // );
    // return result.rows;

    // Mock for now
    return [];
  }

  async createEntry(userId: string, data: CreateTimelineEntryData): Promise<TimelineEntry> {
    // TODO: Insert into database
    // const result = await db.query(
    //   'INSERT INTO timeline_entries (user_id, type, title, description, severity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    //   [userId, data.type, data.title, data.description, data.severity]
    // );
    // return result.rows[0];

    // Mock for now
    return {
      id: 'mock-entry-id',
      userId,
      type: data.type,
      title: data.title,
      description: data.description,
      severity: data.severity,
      createdAt: new Date(),
    };
  }

  async deleteEntry(userId: string, entryId: string): Promise<void> {
    // TODO: Delete from database
    // const result = await db.query(
    //   'DELETE FROM timeline_entries WHERE id = $1 AND user_id = $2',
    //   [entryId, userId]
    // );
    // if (result.rowCount === 0) {
    //   throw new Error('Entry not found or unauthorized');
    // }
  }
}

export const timelineService = new TimelineService();
