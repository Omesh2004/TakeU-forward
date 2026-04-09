import Calendar from '@/components/Calendar/Calendar';

export default function Home() {
  return (
    <main className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Interactive Wall Calendar</p>
        <h1>Plan your month beautifully.</h1>
        <p>
          Select date ranges, keep notes tied to each span, and navigate with a
          paper-like interface that stays smooth on desktop and mobile.
        </p>
      </div>
      <Calendar />
    </main>
  );
}
