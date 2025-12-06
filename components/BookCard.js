import useSWR from 'swr';
import Error from 'next/error';
import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function BookCard({ workId }) {
  const { data, error } = useSWR(workId ? `https://openlibrary.org/works/${workId}.json` : null, fetcher);

  if (error || !data) return <Error statusCode={404} />;

  const coverId = data.covers?.[0];
  const imgSrc = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : `https://via.placeholder.com/200x300?text=No+Cover`;

  return (
    <Card className="h-100" style={{ fontSize: '0.9rem', borderRadius: '15px', overflow: 'hidden' }}>
      <Card.Img
        variant="top"
        className="img-fluid"
        src={imgSrc}
        alt={data.title || 'Book cover'}
        style={{ height: '300px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
      />
      <Card.Body className="p-3" style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Card.Title style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{data.title || ''}</Card.Title>
          <Card.Text style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <strong>Published:</strong> {data.first_publish_date || 'N/A'}
          </Card.Text>
        </div>
        <Button size="sm" as={Link} href={`/works/${workId}`} passHref style={{ borderRadius: '8px' }}>Details</Button>
      </Card.Body>
    </Card>
  );
}
