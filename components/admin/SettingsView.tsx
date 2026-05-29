'use client';

import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 32px;
`;

const Copy = styled.p`
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.5);
`;

const Card = styled.div`
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
`;

const CardTitle = styled.h2`
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 17px;
`;

const CardCopy = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  line-height: 1.55;
`;

export function SettingsView() {
  return (
    <>
      <Header>
        <Title>Settings</Title>
        <Copy>Configure CMS behavior, publishing defaults, API access, and system preferences.</Copy>
      </Header>
      <Grid>
        {['General', 'API Access', 'Publishing', 'Backups'].map((item) => (
          <Card key={item}>
            <CardTitle>{item}</CardTitle>
            <CardCopy>Settings controls are ready for integration with Payload configuration and project preferences.</CardCopy>
          </Card>
        ))}
      </Grid>
    </>
  );
}
