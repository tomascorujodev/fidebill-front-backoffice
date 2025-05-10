export default function CheckInput({ dia, name, evento, value }) {
  return (
    <div className="form-check-inline" style={{marginRight: "10px"}}>
        <label 
          htmlFor={dia} 
          className="form-check-label p-1" 
          style={{
            fontSize: '16px',
            color: '#333',
            fontWeight: '500',
          }}
        >
          {dia} 
        </label>
      <input
        type="checkbox"
        className="form-check-input"
        id={dia}
        name={name}
        value={value}
        checked={value}
        onChange={evento}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          borderColor: '#007bff',
        }}
      />
    </div>
  );
}
