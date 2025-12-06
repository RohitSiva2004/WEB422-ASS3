import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function BookDetails({ book, workId, showFavouriteBtn = true }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    if (workId) setShowAdded(favouritesList?.includes(workId));
  }, [favouritesList, workId]);

  async function favouritesClicked() {
    if (!workId) return;
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(workId));
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(workId));
      setShowAdded(true);
    }
  }

  return (
    <div className="book-details-container">
      <div className="book-details-row">
        <div className="book-image-col">
          <img
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "https://placehold.co/400x600?text=Cover+Not+Available";
            }}
            className="book-cover"
            src={`https://covers.openlibrary.org/b/id/${book?.covers?.[0]}-L.jpg`}
            alt="Cover Image"
          />
        </div>

        <div className="book-info-col">
          <h2 className="book-title">{book.title}</h2>
          {book.description && (
            <p className="book-description">
              {typeof book.description === "string" ? book.description : book.description.value}
            </p>
          )}

          {book.subject_people?.length > 0 && (
            <div className="book-section">
              <h5 className="book-section-title">Characters</h5>
              <p className="book-section-content">{book.subject_people.join(', ')}</p>
            </div>
          )}

          {book.subject_places?.length > 0 && (
            <div className="book-section">
              <h5 className="book-section-title">Settings</h5>
              <p className="book-section-content">{book.subject_places.join(', ')}</p>
            </div>
          )}

          {book.links?.length > 0 && (
            <div className="book-section">
              <h5 className="book-section-title">More Information</h5>
              <div className="book-links">
                {book.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer" className="book-link">
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {showFavouriteBtn && (
            <div className="book-favourite-btn">
              <Button variant={showAdded ? 'primary' : 'outline-primary'} onClick={favouritesClicked}>
                {showAdded ? '+ Favourite (added)' : '+ Favourite'}
              </Button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .book-details-container {
          margin-top: 40px;
        }
        .book-details-row {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
        }
        .book-image-col {
          flex: 0 0 300px;
        }
        .book-cover {
          width: 100%;
          height: auto;
          display: block;
        }
        .book-info-col {
          flex: 1;
          min-width: 300px;
        }
        .book-title {
          font-size: 2rem;
          color: #5dade2;
          margin: 0 0 20px 0;
          font-weight: 400;
        }
        .book-description {
          color: #000;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .book-section {
          margin-bottom: 25px;
        }
        .book-section-title {
          font-size: 1.25rem;
          color: #5dade2;
          margin: 0 0 8px 0;
          font-weight: 400;
        }
        .book-section-content {
          color: #000;
          margin: 0;
          line-height: 1.6;
        }
        .book-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .book-link {
          color: #5dade2;
          text-decoration: underline;
        }
        .book-link:hover {
          color: #4a9fd8;
        }
        .book-favourite-btn {
          margin-top: 20px;
        }
        @media (max-width: 768px) {
          .book-details-row {
            flex-direction: column;
          }
          .book-image-col {
            flex: 1;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
