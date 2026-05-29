'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

type CommentDoc = {
  author?: string | null;
  content?: string | null;
  createdAt?: string | null;
  id: string | number;
  parentComment?: string | number | { id?: string | number } | null;
};

const Wrap = styled.section`
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  color: #fff;
  font-size: 1.5rem;
  font-style: italic;
`;

const List = styled.div`
  display: grid;
  gap: 14px;
  margin-bottom: 1.5rem;
`;

const Card = styled.article<{ $reply?: boolean }>`
  margin-left: ${({ $reply }) => ($reply ? '28px' : '0')};
  padding: 14px;
  border: 1px solid rgba(255,106,0,0.2);
  border-radius: 8px;
  background: rgba(20, 12, 8, 0.72);
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  color: rgba(255,255,255,0.56);
  font-size: 0.8rem;
  font-weight: 800;
`;

const ReplyButton = styled.button`
  border: 0;
  background: transparent;
  color: #ff8b3d;
  cursor: pointer;
  font-weight: 900;
`;

const Form = styled.form`
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255,106,0,0.24);
  border-radius: 8px;
  background: rgba(20, 12, 8, 0.85);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  background: #0f0f13;
  color: #fff;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  background: #0f0f13;
  color: #fff;
`;

const Submit = styled.button`
  justify-self: start;
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 6px;
  background: #ff6a00;
  color: #fff;
  cursor: pointer;
  font-weight: 900;
`;

function parentId(comment: CommentDoc) {
  if (!comment.parentComment) return '';
  if (typeof comment.parentComment === 'object') return String(comment.parentComment.id ?? '');
  return String(comment.parentComment);
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<CommentDoc | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const rootComments = useMemo(() => comments.filter((comment) => !parentId(comment)), [comments]);
  const replies = useMemo(
    () =>
      comments.reduce<Record<string, CommentDoc[]>>((acc, comment) => {
        const parent = parentId(comment);
        if (parent) acc[parent] = [...(acc[parent] ?? []), comment];
        return acc;
      }, {}),
    [comments],
  );

  useEffect(() => {
    fetch(`/api/public/comments?post=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data.comments) ? data.comments : []))
      .catch(() => setComments([]));
  }, [postId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/public/comments', {
        body: JSON.stringify({
          author,
          content,
          email,
          parentComment: replyTo?.id,
          post: postId,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!res.ok) {
        setMessage('Could not submit comment.');
        return;
      }

      setAuthor('');
      setEmail('');
      setContent('');
      setReplyTo(null);
      setMessage('Comment submitted. It will appear after moderation.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Wrap>
      <Title>Comments</Title>
      <List>
        {rootComments.map((comment) => (
          <div key={comment.id}>
            <Card>
              <Meta><span>{comment.author || 'Anonymous'}</span><span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}</span></Meta>
              <div>{comment.content}</div>
              <ReplyButton onClick={() => setReplyTo(comment)} type="button">Reply</ReplyButton>
            </Card>
            {(replies[String(comment.id)] ?? []).map((reply) => (
              <Card $reply key={reply.id}>
                <Meta><span>{reply.author || 'Anonymous'}</span><span>{reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ''}</span></Meta>
                <div>{reply.content}</div>
              </Card>
            ))}
          </div>
        ))}
        {!rootComments.length ? <div style={{ color: 'rgba(255,255,255,0.56)' }}>No comments yet.</div> : null}
      </List>
      <Form onSubmit={submit}>
        <strong>{replyTo ? `Replying to ${replyTo.author || 'comment'}` : 'Leave a comment'}</strong>
        {replyTo ? <ReplyButton onClick={() => setReplyTo(null)} type="button">Cancel reply</ReplyButton> : null}
        <Row>
          <Input onChange={(event) => setAuthor(event.target.value)} placeholder="Name" required value={author} />
          <Input onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" value={email} />
        </Row>
        <Textarea onChange={(event) => setContent(event.target.value)} placeholder="Comment" required value={content} />
        {message ? <div style={{ color: '#ffb37a' }}>{message}</div> : null}
        <Submit disabled={submitting} type="submit">{submitting ? 'Submitting...' : 'Submit Comment'}</Submit>
      </Form>
    </Wrap>
  );
}
