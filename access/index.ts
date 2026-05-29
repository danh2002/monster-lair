import type { Access } from 'payload';

const getRole = (user: unknown) => (user as { role?: string } | null | undefined)?.role;

export const isAdmin: Access = ({ req }) => getRole(req.user) === 'admin';

export const isEditor: Access = ({ req }) => ['admin', 'editor'].includes(getRole(req.user) ?? '');

export const isAuthor: Access = ({ req }) => req.user != null;

export const isLoggedIn = ({ req }: { req: any }) => Boolean(req.user);

export const isAdminOrSelf: Access = ({ req }) => {
  if (getRole(req.user) === 'admin') return true;

  return {
    author: {
      equals: req.user?.id,
    },
  };
};
