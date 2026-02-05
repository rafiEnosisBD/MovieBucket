import Link from 'next/link';

export default function PageHeader({ title = 'Movie Bucket', subtitle }) {
  return (
    <header className="page-header">
      <div className="title-wrapper">
        <h1>
          <Link className="header-link" href="/">
            {title}
          </Link>
        </h1>
      </div>
      {subtitle ? <h2>{subtitle}</h2> : null}
    </header>
  );
}

