function InputField({
    label,
    type = 'text',
    id,
    name,
    value,
    onChange,
    required = false,
    className = '',
  }) {
    return (
      <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          required={required}
        />
      </div>
    );
  }
  
  export default InputField;