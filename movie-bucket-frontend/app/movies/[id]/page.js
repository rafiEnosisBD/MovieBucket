'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/PageHeader';
import Loading from '@/app/components/Loading';
import ErrorBanner from '@/app/components/ErrorBanner';
import PosterThumb from '@/app/components/PosterThumb';
import { movieApi } from '@/lib/api/movies';
import { formatDate } from '@/lib/utils/date';
import { toEmbeddableVideoUrl } from '@/lib/utils/video';

export default function MovieDetailPage({ params }) {
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setErrorMessage('');
        setLoading(true);
        const m = await movieApi.getById(id);
        setMovie(m);
      } catch (err) {
        if (err?.status === 404) setErrorMessage('Movie not found.');
        else setErrorMessage(err?.message || 'Failed to load movie.');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const title = movie?.title ?? movie?.Title ?? '';
  const posterUrl = movie?.posterUrl ?? movie?.PosterUrl ?? '';
  const genre = movie?.genre ?? movie?.Genre ?? '';
  const rating = movie?.rating ?? movie?.Rating ?? '';
  const releaseDate = movie?.releaseDate ?? movie?.ReleaseDate ?? '';
  const language = movie?.language ?? movie?.Language ?? '';
  const synopsis = movie?.synopsis ?? movie?.Synopsis ?? '';
  const videoLink = movie?.videoLink ?? movie?.VideoLink ?? '';
  const embedUrl = toEmbeddableVideoUrl(videoLink);

  return (
    <div className="container">
      <PageHeader subtitle="Movie Details" />
      <ErrorBanner message={errorMessage} />

      {loading ? (
        <Loading />
      ) : !movie ? (
        <div style={{ textAlign: 'center', padding: 10 }}>
          <button className="secondary-btn" onClick={() => router.push('/')}>
            Back
          </button>
        </div>
      ) : (
        <>
          <div className="action-bar">
            <button className="secondary-btn" onClick={() => router.push('/')}>
              Back
            </button>
            <button className="primary-btn" onClick={() => router.push(`/movies/${id}/edit`)}>
              Edit
            </button>
          </div>

          <div className="media-section">
            <div className="media-box">
              {posterUrl ? (
                <PosterThumb src={posterUrl} alt={title} />
              ) : (
                <div style={{ padding: 14, color: '#666' }}>Image not found</div>
              )}
            </div>

            <div className="media-box details-section" style={{ textAlign: 'left' }}>
              <h2 style={{ marginBottom: 10 }}>{title}</h2>
              <p>
                <b>Release Date:</b> {formatDate(releaseDate)}
              </p>
              <p>
                <b>Genre:</b> {genre}
              </p>
              <p>
                <b>Rating:</b> {rating}
              </p>
              <p>
                <b>Language:</b> {language}
              </p>
              <div style={{ marginTop: 10 }}>
                <b>Synopsis:</b>
                <div className="synopsis-scroll" style={{ marginTop: 6 }}>
                  {synopsis}
                </div>
              </div>
            </div>
          </div>

          <hr className="detail-divider" />

          <div className="media-box">
            <h3 style={{ marginBottom: 10 }}>Trailer / Video</h3>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div style={{ padding: 14, color: '#666' }}>Video not found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

