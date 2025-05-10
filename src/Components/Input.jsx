
export default function Input({ id = Math.floor(Math.random() * 999999999) + 1, type = "text", onChange, value, className = "", style = {}, regex = null, disabled = false, isFormValid, setIsFormValid }){

    function handleChange(e){
        const { value } = e.target.value;
        if (regex && !regex.test(value)) {
            setIsFormValid(false);
        }else{
            setIsFormValid(true);
            onChange(e);
        }
    };

    const inputStyle = {
        ...style,
        border: isFormValid ? '1px solid #ccc' : '1px solid red'
      };
    
  return (
    <input id={id} type={type} value={value} onChange={handleChange} className={className} style={inputStyle} disabled={disabled} />
  );
  
};

