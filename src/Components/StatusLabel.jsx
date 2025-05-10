export default function StatusLabel({ status }) {
  return (
    <span
      className={`badge ${status === 1 ? 'bg-success' : 'bg-danger'}`}
    >
      {status === 1 ? 'Activa' : 'Cancelada'}
    </span>
  );
}