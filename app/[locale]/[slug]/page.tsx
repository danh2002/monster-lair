import { notFound } from 'next/navigation';
import styled from 'styled-components';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getPageBySlug } from '@/lib/api/pages';

const PageShell = styled.main<{ $template?: string }>`
  min-height: calc(100vh - 58px);
  padding: 58px 0 0;
  background: #08070b;
  color: #fff;
`;

const Inner = styled.article<{ $template?: string }>`
  width: ${({ $template }) => ($template === 'full-width' || $template === 'landing' ? 'min(100%, 1280px)' : 'min(100%, 980px)')};
  margin: 0 auto;
  padding: clamp(3rem, 7vw, 5rem) clamp(1rem, 3vw, 2rem);
  color: rgba(255,255,255,0.82);
  font-size: 1.04rem;
  line-height: 1.8;

  h1 {
    margin: 0 0 1.4rem;
    color: #fff;
    font-size: clamp(2.4rem, 5vw, 4.2rem);
    font-style: italic;
    font-weight: 900;
    line-height: 1;
  }

  h2,
  h3,
  h4 {
    color: #fff;
  }

  a {
    color: #ff8b3d;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1.2rem 0;
    border-radius: 8px;
  }

  iframe {
    width: 100%;
    max-width: 760px;
    aspect-ratio: 16 / 9;
    height: auto;
    border: 0;
    border-radius: 8px;
  }

  table {
    width: 100%;
    margin: 1.2rem 0;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.7rem;
    border: 1px solid rgba(255,255,255,0.16);
  }

  blockquote {
    margin: 1.2rem 0;
    padding-left: 1rem;
    border-left: 3px solid #ff6a00;
    color: rgba(255,255,255,0.68);
  }
`;

type PayloadDoc = Record<string, any>;

async function fetchPage(slug: string) {
  try {
    const result = await getPageBySlug(decodeURIComponent(slug));
    const page = result.data;

    return page && String(page.status ?? 'published') === 'published' ? (page as PayloadDoc) : null;
  } catch {
    return null;
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const page = await fetchPage(slug);

  if (!page) notFound();

  return (
    <>
      <Navbar />
      <PageShell $template={page.template}>
        <Inner $template={page.template}>
          <h1>{page.title}</h1>
          {page.content ? <div dangerouslySetInnerHTML={{ __html: page.content }} /> : null}
        </Inner>
      </PageShell>
      <Footer />
    </>
  );
}
