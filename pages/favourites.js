import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import PageHeader from '@/components/PageHeader';
import BookCard from '@/components/BookCard';
import { Row, Col } from 'react-bootstrap';

export default function Favourites() {
  const [favouritesList] = useAtom(favouritesAtom);

  if (!favouritesList) return null;
  if (favouritesList.length === 0) {
    return <PageHeader text="Nothing Here" subtext="Add a book to your favourites to see it here." />;
  }

  return (
    <>
      <PageHeader text="Favourites" subtext="All your favourite books, in one place" />
      <Row className="gy-3">
        {favouritesList.map(workId => (
          <Col key={workId} lg={2} md={4} sm={6} xs={12}>
            <BookCard workId={workId} />
          </Col>
        ))}
      </Row>
    </>
  );
}
