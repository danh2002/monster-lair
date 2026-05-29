import { Resend } from 'resend';

type PostLike = {
  id?: string | number;
  slug?: string;
  title?: string;
};

type CommentLike = {
  author?: string;
  content?: string;
  email?: string;
  id?: string | number;
};

const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@dinoisland.com';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Monster Lair <onboarding@resend.dev>';

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'your_key') return null;
  return new Resend(apiKey);
}

export async function sendNewPostNotification(post: PostLike) {
  const resend = getClient();
  if (!resend) {
    console.log(`[Email] Skipped new post notification for "${post.title ?? post.id}" because RESEND_API_KEY is not configured.`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New post published: ${post.title ?? 'Untitled'}`,
    html: `<p>A new post has been published.</p><p><strong>${post.title ?? 'Untitled'}</strong></p><p>Slug: ${post.slug ?? ''}</p>`,
  });
}

export async function sendNewCommentNotification(comment: CommentLike, post: PostLike | null) {
  const resend = getClient();
  if (!resend) {
    console.log(`[Email] Skipped new comment notification from "${comment.author ?? 'Anonymous'}" because RESEND_API_KEY is not configured.`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New comment pending moderation${post?.title ? ` on ${post.title}` : ''}`,
    html: `
      <p>A new comment is waiting for moderation.</p>
      <p><strong>Author:</strong> ${comment.author ?? 'Anonymous'} (${comment.email ?? 'no email'})</p>
      <p><strong>Post:</strong> ${post?.title ?? 'Unknown post'}</p>
      <p>${comment.content ?? ''}</p>
    `,
  });
}
