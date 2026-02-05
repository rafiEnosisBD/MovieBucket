'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/PageHeader';
import Loading from '@/app/components/Loading';
import ErrorBanner from '@/app/components/ErrorBanner';
import PosterThumb from '@/app/components/PosterThumb';
import { movieApi } from '@/lib/api/movies';
import { toDateInputValue } from '@/lib/utils/date';

const REQUIRED_MESSAGE = '* The field is required.';

function normalizeModelStateErrors(data) {
  const errors = data?.errors || data?.Errors;
  if (!errors || typeof errors !== 'object') return {};
  const out = {};
  for (const key of Object.keys(errors)) {
    const msgs = Array.isArray(errors[key]) ? errors[key] : [String(errors[key])];
    out[key] = msgs.filter(Boolean);
  }
  return out;
}

function pickFieldErrors(modelErrors, fieldCandidates) {
  for (const key of fieldCandidates) {
    if (modelErrors[key]?.length) return modelErrors[key];
  }
  return [];
}

export default function MovieUpsertForm({ movieId }) {
  const router = useRouter();
  const isEdit = Boolean(movieId);

  const genreOptions = useMemo(
    () => ['', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime','Documentary' ,'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'],
    []
  );
  const languageOptions = useMemo(
    () => ['', 'English', 'Spanish', 'French', 'German', 'Hindi', 'Urdu', 'Japanese', 'Korean', 'Italian'],
    []
  );

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    title: '',
    genre: '',
    rating: '',
    releaseDate: '',
    language: '',
    videoLink: '',
    synopsis: '',
  });
  const [existingPosterUrl, setExistingPosterUrl] = useState('');
  const [posterFile, setPosterFile] = useState(null);

  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    const run = async () => {
      if (!isEdit) return;
      try {
        setErrorMessage('');
        setLoading(true);
        const movie = await movieApi.getById(movieId);
        setForm({
          title: movie?.title ?? movie?.Title ?? '',
          genre: movie?.genre ?? movie?.Genre ?? '',
          rating: String(movie?.rating ?? movie?.Rating ?? ''),
          releaseDate: toDateInputValue(movie?.releaseDate ?? movie?.ReleaseDate),
          language: movie?.language ?? movie?.Language ?? '',
          videoLink: movie?.videoLink ?? movie?.VideoLink ?? '',
          synopsis: movie?.synopsis ?? movie?.Synopsis ?? '',
        });
        setExistingPosterUrl(movie?.posterUrl ?? movie?.PosterUrl ?? '');
      } catch (err) {
        if (err?.status === 404) setErrorMessage('Movie not found.');
        else setErrorMessage(err?.message || 'Failed to load movie.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [isEdit, movieId]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = [REQUIRED_MESSAGE];
    if (!form.genre) e.genre = [REQUIRED_MESSAGE];
    if (form.rating === '' || form.rating === null) e.rating = [REQUIRED_MESSAGE];
    if (!form.releaseDate) e.releaseDate = [REQUIRED_MESSAGE];
    if (!form.language) e.language = [REQUIRED_MESSAGE];
    if (!form.synopsis.trim()) e.synopsis = [REQUIRED_MESSAGE];

    const ratingNum = Number(form.rating);
    if (form.rating !== '' && (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10)) {
      e.rating = [...(e.rating || []), 'Rating must be between 1 and 10.'];
    }

    setClientErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setServerErrors({});

    if (!validate()) return;

    const fd = new FormData();
    fd.append('Title', form.title);
    fd.append('Genre', form.genre);
    fd.append('Rating', String(form.rating));
    fd.append('ReleaseDate', form.releaseDate);
    fd.append('Language', form.language);
    fd.append('VideoLink', form.videoLink || '');
    fd.append('Synopsis', form.synopsis);
    if (posterFile) fd.append('poster', posterFile);

    try {
      setSubmitting(true);
      if (isEdit) await movieApi.update(movieId, fd);
      else await movieApi.create(fd);
      router.push('/');
    } catch (err) {
      const ms = normalizeModelStateErrors(err?.data);
      setServerErrors(ms);
      setErrorMessage(err?.message || 'Failed to save movie.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldErrorLines = (fieldKey, serverKeys) => {
    const lines = [];
    if (clientErrors[fieldKey]?.length) lines.push(...clientErrors[fieldKey]);
    const srv = pickFieldErrors(serverErrors, serverKeys);
    if (srv.length) lines.push(...srv);
    return lines;
  };

  const subtitle = isEdit ? 'Update Movie' : 'Add Movie';

  return (
    <div className="container">
      <PageHeader subtitle={subtitle} />

      <ErrorBanner message={errorMessage} />

      {loading ? (
        <Loading />
      ) : (
        <form className="form-container" onSubmit={submit}>
          <div className="required-note">
            Fields marked with <span className="required">*</span> are required.
          </div>

          <div className="form-group">
            <label>
              Title <span className="required">*</span>
            </label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            {fieldErrorLines('title', ['Title', 'title']).map((m, idx) => (
              <div key={idx} className="inline-error">
                {m}
              </div>
            ))}
          </div>      

          <div className="form-group">
            <label>
              Genre <span className="required">*</span>
            </label>
            <select value={form.genre} onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}>
              {genreOptions.map((g) => (
                <option key={g || 'none'} value={g}>
                  {g ? g : 'Select genre'}
                </option>
              ))}
            </select>
            {fieldErrorLines('genre', ['Genre', 'genre']).map((m, idx) => (
              <div key={idx} className="inline-error">
                {m}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>
              Rating (1-10) <span className="required">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={10}
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
            />
            {fieldErrorLines('rating', ['Rating', 'rating']).map((m, idx) => (
              <div key={idx} className="inline-error">
                {m}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>
              Release Date <span className="required">*</span>
            </label>
            <input
              type="date"
              value={form.releaseDate}
              onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))}
            />
            {fieldErrorLines('releaseDate', ['ReleaseDate', 'releaseDate']).map((m, idx) => (
              <div key={idx} className="inline-error">
                {m}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>
              Language <span className="required">*</span>
            </label>
            <select value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}>
              {languageOptions.map((l) => (
                <option key={l || 'none'} value={l}>
                  {l ? l : 'Select language'}
                </option>
              ))}
            </select>
            {fieldErrorLines('language', ['Language', 'language']).map((m, idx) => (
              <div key={idx} className="inline-error">
                {m}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Video Link</label>
            <input value={form.videoLink} onChange={(e) => setForm((p) => ({ ...p, videoLink: e.target.value }))} />
            {pickFieldErrors(serverErrors, ['VideoLink', 'videoLink']).map((m, idx) => (
              <div key={idx} className="inline-error">
                {m}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Poster</label>
            {existingPosterUrl ? (
              <div style={{ marginBottom: 8 }}>
                <PosterThumb src={existingPosterUrl} alt={form.title} />
                <div className="inline-help" style={{ marginTop: 6 }}>
                  Uploading a new poster will replace the existing one.
                </div>
              </div>
            ) : null}
            <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} />
          </div>

          <div className="form-group">
            <label>
              Synopsis <span className="required">*</span>
            </label>
            <textarea
              rows={5}
              value={form.synopsis}
              onChange={(e) => setForm((p) => ({ ...p, synopsis: e.target.value }))}
            />
            {fieldErrorLines('synopsis', ['Synopsis', 'synopsis']).map((m, idx) => (
              <div key={idx} className="inline-error">
                {m}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button className="primary-btn" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

