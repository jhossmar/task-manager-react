type FooterProps = {
    total: number;
    completed: number;
    pending: number;
};
function Footer(props: FooterProps) {
    return (
        <footer>
            <p>Total de tareas: {props.total}</p>
            <p>Completadas: {props.completed}</p>
            <p>Pendientes: {props.pending}</p>
        </footer>
    );
}
export default Footer;