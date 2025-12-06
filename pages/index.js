/*********************************************************************************
* WEB422 – Assignment 3
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Rohit Sivakumar Student ID: 104670229 Date: 12/5/2025
*
* Vercel App (Deployed) Link: https://web-422-ass-3-zbhk-gmu0eom4j-rohitsiva2004s-projects.vercel.app/
*
********************************************************************************/

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  function onSubmit(data) {
    router.push({
      pathname: '/books',
      query: Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''))
    });
  }

  return (
    <div className="search-container">
      <div className="search-content">
        <div className="search-header">
          <h1 className="search-title">Search for Books</h1>
          <p className="search-subtitle">Browse the extensive collection of books available on openlibrary.org.</p>
        </div>
        
        <form className="search-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="search-form-grid">
            <div className="form-group">
              <label className="form-label">Author *</label>
              <input
                type="text"
                className={`form-input ${errors.author ? 'is-invalid' : ''}`}
                {...register('author', { required: true })}
                placeholder="Enter author"
              />
              {errors.author && <div className="invalid-feedback">Author is required.</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                {...register('title')}
                placeholder="Enter title"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Language Code</label>
              <input
                type="text"
                className="form-input"
                {...register('language')}
                placeholder="Enter language code (e.g. eng)"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Subject (contains)</label>
              <input
                type="text"
                className="form-input"
                {...register('subject')}
                placeholder="Enter subject keyword"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">First Published (Year)</label>
              <input
                type="text"
                className="form-input"
                {...register('first_publish_year')}
                placeholder="Enter published year"
              />
            </div>
          </div>
          
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .search-container {
          background: white;
          min-height: 100vh;
          padding: 40px 20px;
        }
        .search-content {
          max-width: 1000px;
          margin: 0 auto;
        }
        .search-header {
          background: #f5f5f5;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
          text-align: center;
        }
        .search-title {
          font-size: 2.5rem;
          color: #5dade2;
          margin: 0 0 10px 0;
          font-weight: 400;
        }
        .search-subtitle {
          color: #666;
          margin: 0;
          font-size: 0.95rem;
        }
        .search-form {
          background: white;
        }
        .search-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          display: block;
          color: #666;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        .form-input {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: #5dade2;
        }
        .form-input.is-invalid {
          border-color: #dc3545;
        }
        .invalid-feedback {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 5px;
        }
        .search-button {
          width: 100%;
          padding: 15px;
          font-size: 1.25rem;
          background: linear-gradient(to bottom, #5dade2, #4a9fd8);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        .search-button:hover {
          background: linear-gradient(to bottom, #4a9fd8, #3d8fc7);
        }
        @media (max-width: 768px) {
          .search-form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
