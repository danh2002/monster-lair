import type { CollectionAfterChangeHook } from 'payload';

type AuditCollection =
  | 'banners'
  | 'comments'
  | 'dinosaurs'
  | 'events'
  | 'media'
  | 'packages'
  | 'pages'
  | 'patch-notes'
  | 'popups'
  | 'posts'
  | 'server-status';
type AuditAction = 'created' | 'updated' | 'published' | 'uploaded';

const getDocumentTitle = (doc: Record<string, unknown>) => {
  const title = doc.title ?? doc.name ?? doc.filename ?? doc.alt;
  return typeof title === 'string' ? title : undefined;
};

const getChangedFields = (previousDoc: Record<string, unknown> | undefined, doc: Record<string, unknown>) => {
  if (!previousDoc) return doc;

  return Object.keys(doc).reduce<Record<string, { before: unknown; after: unknown }>>((changes, key) => {
    const before = previousDoc[key];
    const after = doc[key];

    if (JSON.stringify(before) !== JSON.stringify(after)) {
      changes[key] = { before, after };
    }

    return changes;
  }, {});
};

const getAction = (
  collection: AuditCollection,
  operation: 'create' | 'update',
  previousDoc: Record<string, unknown> | undefined,
  doc: Record<string, unknown>,
): AuditAction => {
  if (collection === 'media' && operation === 'create') return 'uploaded';
  if (operation === 'create') return 'created';
  if (previousDoc?.status !== 'published' && doc.status === 'published') return 'published';

  return 'updated';
};

export const createAuditLog =
  (collection: AuditCollection): CollectionAfterChangeHook =>
  async ({ doc, operation, previousDoc, req }) => {
    const user = req.user;

    try {
      await req.payload.create({
        collection: 'audit-logs' as any,
        data: {
          action: getAction(collection, operation, previousDoc, doc),
          changes: getChangedFields(previousDoc, doc),
          collection,
          documentId: String(doc.id),
          documentTitle: getDocumentTitle(doc),
          performedBy: user?.id,
          timestamp: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      });
    } catch (error) {
      req.payload.logger.warn({ collection, err: error }, 'Audit log write failed');
    }

    return doc;
  };
