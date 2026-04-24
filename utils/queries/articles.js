import { mysqlPool } from '@/utils/db';

export async function getArticles({
  status = 'published',
  article_type,
  category_slug,
  tag_slug,
  search,
  page = 1,
  limit = 12,
} = {}) {
  const conn = await mysqlPool.getConnection();
  try {
    const offset = (Number(page) - 1) * Number(limit);
    const params = [];

    let sql = `
      SELECT
        a.id, a.title, a.slug, a.excerpt, a.cover_image,
        a.status, a.article_type, a.view_count, a.published_at,
        u.full_name AS author_name, u.avatar_url AS author_avatar
      FROM articles a
      JOIN users u ON u.id = a.author_id
    `;

    if (category_slug) {
      sql += `
        JOIN article_categories ac ON ac.article_id = a.id
        JOIN categories c ON c.id = ac.category_id AND c.slug = ?
      `;
      params.push(category_slug);
    }

    if (tag_slug) {
      sql += `
        JOIN article_tags at2 ON at2.article_id = a.id
        JOIN tags t ON t.id = at2.tag_id AND t.slug = ?
      `;
      params.push(tag_slug);
    }

    sql += ` WHERE a.status = ?`;
    params.push(status);

    if (article_type) {
      sql += ` AND a.article_type = ?`;
      params.push(article_type);
    }

    if (search) {
      sql += ` AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY a.published_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    const [rows] = await conn.execute(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
export async function createArticle(data) {
  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      author_id, title, slug, content, excerpt,
      cover_image, status = 'draft', article_type = 'news',
      category_ids = [], tag_ids = [],
      published_at = null,
    } = data;

    await conn.execute(
      `INSERT INTO articles
         (author_id, title, slug, content, excerpt, cover_image,
          status, article_type, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [author_id, title, slug, content, excerpt ?? null,
        cover_image ?? null, status, article_type, published_at]
    );

    const [[{ id: articleId }]] = await conn.execute(
      `SELECT id FROM articles WHERE slug = ?`, [slug]
    );

    if (category_ids.length) {
      const catValues = category_ids.map(cid => [articleId, cid]);
      await conn.query(`INSERT INTO article_categories (article_id, category_id) VALUES ?`, [catValues]);
    }
    if (tag_ids.length) {
      const tagValues = tag_ids.map(tid => [articleId, tid]);
      await conn.query(`INSERT INTO article_tags (article_id, tag_id) VALUES ?`, [tagValues]);
    }

    await conn.commit();
    return { id: articleId, slug };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function updateArticle(id, data) {
  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();

    const allowed = ['title', 'slug', 'content', 'excerpt', 'cover_image',
      'status', 'article_type', 'published_at'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));

    if (fields.length) {
      const sql = `UPDATE articles SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`;
      const values = [...fields.map(f => data[f]), id];
      await conn.execute(sql, values);
    }

    if (data.category_ids !== undefined) {
      await conn.execute(`DELETE FROM article_categories WHERE article_id = ?`, [id]);
      const validIds = (data.category_ids || []).filter(id => id && id !== ''); // ← fixed
      if (validIds.length) {
        const catValues = validIds.map(cid => [id, cid]);
        await conn.query(`INSERT INTO article_categories (article_id, category_id) VALUES ?`, [catValues]);
      }
    }

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
export async function deleteArticle(id) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(`DELETE FROM articles WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

export async function countArticles({ status = 'published', article_type, search } = {}) {
  const conn = await mysqlPool.getConnection();
  try {
    let sql = `SELECT COUNT(*) AS total FROM articles a WHERE a.status = ?`;
    const params = [status];

    if (article_type) {
      sql += ` AND a.article_type = ?`;
      params.push(article_type);
    }
    if (search) {
      sql += ` AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const [[{ total }]] = await conn.execute(sql, params);
    return total;
  } finally {
    conn.release();
  }
}
export async function getArticleById(id) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT a.*, u.full_name AS author_name, u.avatar_url AS author_avatar
       FROM articles a
       JOIN users u ON u.id = a.author_id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
}

export async function getArticleBySlug(slug) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT a.*, u.full_name AS author_name, u.avatar_url AS author_avatar,
       GROUP_CONCAT(DISTINCT c.name SEPARATOR ',') AS categories,
       GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tags
       FROM articles a
       JOIN users u ON u.id = a.author_id
       LEFT JOIN article_categories ac ON ac.article_id = a.id
       LEFT JOIN categories c ON c.id = ac.category_id
       LEFT JOIN article_tags at2 ON at2.article_id = a.id
       LEFT JOIN tags t ON t.id = at2.tag_id
       WHERE a.slug = ?
       GROUP BY a.id`,
      [slug]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
}

export async function incrementViewCount(id) {
  const conn = await mysqlPool.getConnection();
  try {
    await conn.execute(
      `UPDATE articles SET view_count = view_count + 1 WHERE id = ?`,
      [id]
    );
  } finally {
    conn.release();
  }
}