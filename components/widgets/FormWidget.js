'use client';

import { useState } from 'react';

export default function FormWidget({ data, onSubmit }) {
  const { fields, title, submitLabel, timestamp } = data;
  const [formData, setFormData] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const { name, label, type, options, placeholder, required } = field;

    switch (type) {
      case 'text':
      case 'email':
      case 'number':
      case 'tel':
        return (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            required={required}
            value={formData[name] || ''}
            onChange={(e) => handleChange(name, e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            placeholder={placeholder}
            required={required}
            value={formData[name] || ''}
            onChange={(e) => handleChange(name, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            name={name}
            required={required}
            value={formData[name] || ''}
            onChange={(e) => handleChange(name, e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {options?.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              required={required}
              checked={formData[name] || false}
              onChange={(e) => handleChange(name, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-300">{label}</label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value || option}
                  checked={formData[name] === (option.value || option)}
                  onChange={(e) => handleChange(name, e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-300">
                  {option.label || option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-widget bg-gray-800 rounded-lg p-4 mb-3">
      {title && (
        <h3 className="text-lg font-semibold text-gray-100 mb-4">{title}</h3>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            {field.type !== 'checkbox' && (
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {submitLabel || 'Submit'}
        </button>
      </form>
      {timestamp && (
        <span className="text-xs text-gray-500 mt-2 block">
          {new Date(timestamp).toLocaleString()}
        </span>
      )}
    </div>
  );
}
