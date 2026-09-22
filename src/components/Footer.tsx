type FooterProps = {
  total: number;
  completed: number;
  pending: number;
  onClearCompleted: () => void;
};

function Footer({ total, completed, pending, onClearCompleted }: FooterProps) {
  return (
    <footer className="app-footer">
      <div className="footer-stat">Total: <span>{total}</span></div>
      <div className="footer-stat">Completed: <span className="stat-done">{completed}</span></div>
      <div className="footer-stat">Pending: <span className="stat-pending">{pending}</span></div>
      {completed > 0 && (
        <button type="button" className="clear-completed-btn" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
export default Footer;