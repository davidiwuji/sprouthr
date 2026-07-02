-- ============================================================
-- 1. Analytics events table
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event     ON analytics_events(event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page      ON analytics_events(page_path, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session   ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created   ON analytics_events(created_at);

-- ============================================================
-- 2. Summary function (weekly / monthly / all-time)
-- ============================================================
CREATE OR REPLACE FUNCTION get_analytics_summary()
RETURNS JSON LANGUAGE SQL AS $$
  SELECT json_build_object(
    'all_time', json_build_object(
      'page_views',       (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'page_view'),
      'unique_visitors',  (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_name = 'page_view'),
      'applications',     (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'apply'),
      'total_events',     (SELECT COUNT(*) FROM analytics_events),
      'top_pages',        (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
                            SELECT page_path, COUNT(*) as views
                            FROM analytics_events WHERE event_name = 'page_view'
                            GROUP BY page_path ORDER BY COUNT(*) DESC LIMIT 10
                          ) t)
    ),
    'this_month', json_build_object(
      'page_views',       (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'page_view'
                            AND created_at >= date_trunc('month', NOW())),
      'unique_visitors',  (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_name = 'page_view'
                            AND created_at >= date_trunc('month', NOW()))
    ),
    'this_week', json_build_object(
      'page_views',       (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'page_view'
                            AND created_at >= date_trunc('week', NOW())),
      'unique_visitors',  (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_name = 'page_view'
                            AND created_at >= date_trunc('week', NOW()))
    ),
    'daily_trend', (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
      SELECT DATE(created_at) as day, COUNT(*) as views
      FROM analytics_events WHERE event_name = 'page_view'
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day ORDER BY day
    ) t),
    'event_breakdown', (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
      SELECT event_name, COUNT(*) as count
      FROM analytics_events WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY event_name ORDER BY COUNT(*) DESC
    ) t)
  );
$$;
