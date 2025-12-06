

import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Pagination, Table } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Books() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState(null);

  const queryString = new URLSearchParams(router.query).toString();
  const { data, error } = useSWR(
    queryString ? `https://openlibrary.org/search.json?${queryString}&page=${page}&limit=10` : null,
    fetcher
  );

  useEffect(() => {
    if (data) setPageData(data);
  }, [data]);

  function previous() {
    if (page > 1) setPage(p => p - 1);
  }
  function next() {
    setPage(p => p + 1);
  }

  const subtext = useMemo(() => {
    const entries = Object.entries(router.query);
    if (!entries.length) return '';
    return entries.map(([k, v]) => `${k}: ${v}`).join(' • ');
  }, [router.query]);

  if (error) return <p>Error loading books.</p>;
  if (!pageData?.docs) return <>
    <PageHeader text="Search Results" subtext={subtext} />
    <p>Loading…</p>
  </>;

  return (
    <>
      <PageHeader text="Search Results" subtext={subtext} />
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author(s)</th>
            <th>First Published</th>
          </tr>
        </thead>
        <tbody>
          {pageData.docs.map((book, i) => (
            <tr
              key={`${book.key}-${i}`}
              onClick={() => router.push(book.key)}
              style={{ cursor: 'pointer' }}
            >
              <td>{book.title}</td>
              <td>{(book.author_name || []).join(', ')}</td>
              <td>{book.first_publish_year || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={previous} disabled={page === 1} />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next onClick={next} />
      </Pagination>
    </>
  );
}
