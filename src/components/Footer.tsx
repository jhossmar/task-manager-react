type FooterProps = {
  total: number;
  completed: number;
  pending: number;
};

function Footer({ total, completed, pending }: FooterProps) {
  return (
    <footer className="app-footer">
      <div className="footer-stat">Total: <span>{total}</span></div>
      <div className="footer-stat">Completed: <span className="stat-done">{completed}</span></div>
      <div className="footer-stat">Pending: <span className="stat-pending">{pending}</span></div>
    </footer>
  );
}
export default Footer;