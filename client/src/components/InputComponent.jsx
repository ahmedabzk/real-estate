
export default function Input({type, placeholder, name, ...props}) {
    return (
        <input type={type} name={name} placeholder={placeholder} {...props} required/>
    );
}