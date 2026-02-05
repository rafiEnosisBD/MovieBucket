'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { movieApi } from '@/lib/api/movies';
import { FaSearch, FaEdit, FaTrash, FaSortUp, FaSortDown } from 'react-icons/fa';
import PageHeader from '@/app/components/PageHeader';
import Loading from '@/app/components/Loading';
import ErrorBanner from '@/app/components/ErrorBanner';
import Pagination from '@/app/components/Pagination';
import PosterThumb from '@/app/components/PosterThumb';
import { formatDate } from '@/lib/utils/date';

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [draftSearchTerm, setDraftSearchTerm] = useState('');
  const [draftFilters, setDraftFilters] = useState({
    genre: '',
    language: '',
    startDate: '',
    endDate: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    language: '',
    startDate: '',
    endDate: '',
  });

  const [sortConfig, setSortConfig] = useState({ sortBy: 'releasedate', sortOrder: 'desc' });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const genreOptions = useMemo(
    () => ['', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime','Documentary' ,'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'],
    []
  );
  const languageOptions = useMemo(
    () => ['', 'English', 'Spanish', 'French', 'German', 'Hindi', 'Urdu', 'Japanese', 'Korean', 'Italian'],
    []
  );

  const fetchMovies = async () => {
    try {
      setErrorMessage('');
      setLoading(true);

      const params = {
        searchTerm: searchTerm || undefined,
        genre: filters.genre || undefined,
        language: filters.language || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        sortBy: sortConfig.sortBy || undefined,
        sortOrder: sortConfig.sortOrder || undefined,
        pageNumber,
        pageSize,
      };

      const result = await movieApi.getAll(params);
      const data = result?.Data ?? result?.data ?? [];
      const total = result?.TotalCount ?? result?.totalCount ?? 0;
      const pn = result?.PageNumber ?? result?.pageNumber ?? pageNumber;
      const ps = result?.PageSize ?? result?.pageSize ?? pageSize;

      setMovies(Array.isArray(data) ? data : []);
      setTotalCount(Number(total) || 0);
      setPageNumber(Number(pn) || 1);
      setPageSize(Number(ps) || pageSize);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to load movies. Please try again.');
      setMovies([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [sortConfig, pageNumber, pageSize, searchTerm, filters]);

  const applySearch = () => {
    setPageNumber(1);
    setSearchTerm(draftSearchTerm);
  };

  const applyFilters = () => {
    setPageNumber(1);
    setFilters(draftFilters);
  };

  const clearFilters = () => {
    setDraftFilters({ genre: '', language: '', startDate: '', endDate: '' });
    setFilters({ genre: '', language: '', startDate: '', endDate: '' });
    setPageNumber(1);
  };

  const toggleSort = (field) => {
    setPageNumber(1);
    setSortConfig((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortIcons = (field) => {
    const active = sortConfig.sortBy === field;
    const asc = active && sortConfig.sortOrder === 'asc';
    const desc = active && sortConfig.sortOrder === 'desc';
    return (
      <span style={{ marginLeft: 6, display: 'inline-flex', flexDirection: 'column', lineHeight: 0.7 }}>
        <FaSortUp style={{ opacity: asc ? 1 : 0.4 }} />
        <FaSortDown style={{ opacity: desc ? 1 : 0.4, marginTop: -6 }} />
      </span>
    );
  };

  const handleDelete = async (id) => {
    const ok = confirm('Do you want to delete this entry?');
    if (!ok) return;

    try {
      setErrorMessage('');
      await movieApi.delete(id);

      const remaining = movies.length - 1;
      if (remaining <= 0 && pageNumber > 1) setPageNumber(pageNumber - 1);
      else fetchMovies();
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to delete movie.');
    }
  };

  return (
    <div className="container">
      <PageHeader />

      <ErrorBanner message={errorMessage} />

      <div className="action-bar">
        <button className="primary-btn" onClick={() => router.push('/movies/new')}>
          Add New
        </button>

        <div className="search-section" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <input
            id="searchInput"
            value={draftSearchTerm}
            onChange={(e) => setDraftSearchTerm(e.target.value)}
            placeholder="Search by movie title..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') applySearch();
            }}
          />
          <button id="searchBtn" onClick={applySearch} aria-label="Search">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="filter-section">
        <div>
          <div className="filter">Genre</div>
          <select
            value={draftFilters.genre}
            onChange={(e) => setDraftFilters((p) => ({ ...p, genre: e.target.value }))}
          >
            {genreOptions.map((g) => (
              <option key={g || 'all'} value={g}>
                {g ? g : 'All Genres'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="filter">Language</div>
          <select
            value={draftFilters.language}
            onChange={(e) => setDraftFilters((p) => ({ ...p, language: e.target.value }))}
          >
            {languageOptions.map((l) => (
              <option key={l || 'all'} value={l}>
                {l ? l : 'All Languages'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="filter">Start Date</div>
          <input
            type="date"
            value={draftFilters.startDate}
            onChange={(e) => setDraftFilters((p) => ({ ...p, startDate: e.target.value }))}
          />
        </div>

        <div>
          <div className="filter">End Date</div>
          <input
            type="date"
            value={draftFilters.endDate}
            onChange={(e) => setDraftFilters((p) => ({ ...p, endDate: e.target.value }))}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginTop: 30 }}>
          <button className="secondary-btn" onClick={applyFilters}>
            Filter
          </button>
          <button className="secondary-btn" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <table className="hotel-table">
            <thead>
              <tr>
                <th style={{ cursor: 'default' }}>Poster</th>
                <th className="name-column" onClick={() => toggleSort('title')}>
                  Title {sortIcons('title')}
                </th>
                <th onClick={() => toggleSort('genre')}>Genre {sortIcons('genre')}</th>
                <th onClick={() => toggleSort('releasedate')}>Release Date {sortIcons('releasedate')}</th>
                <th onClick={() => toggleSort('language')}>Language {sortIcons('language')}</th>
                <th style={{ cursor: 'default' }}>Options</th>
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 16 }}>
                    No movies found.
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id ?? movie.Id}>
                    <td>
                      <PosterThumb src={movie.posterUrl } alt={movie.title ?? movie.Title} />
                    </td>
                    <td>
                      <Link href={`/movies/${movie.id}`}>{movie.title }</Link>
                    </td>
                    <td>{movie.genre}</td>
                    <td>{formatDate(movie.releaseDate)}</td>
                    <td>{movie.language}</td>
                    <td className="options-cell">
                      <div className="options">
                        <button
                          title="Edit"
                          onClick={() => router.push(`/movies/${movie.id}/edit`)}
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(movie.id)}
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={(n) => setPageNumber(n)}
            onPageSizeChange={(n) => {
              setPageNumber(1);
              setPageSize(n);
            }}
          />
        </>
      )}
    </div>
  );
}
