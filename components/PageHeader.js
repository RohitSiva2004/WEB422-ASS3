import { Card } from 'react-bootstrap';

export default function PageHeader({ text, subtext }) {
  return (
    <>
      <Card className="bg-light border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex flex-column">
            <strong className="h4 mb-1">{text}</strong>
            {subtext ? <div className="text-muted">{subtext}</div> : null}
          </div>
        </Card.Body>
      </Card>
      <br />
    </>
  );
}
