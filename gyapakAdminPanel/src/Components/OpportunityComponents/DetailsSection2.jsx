import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight } from 'lucide-react';

const NestedObjectEditor = ({ object, onUpdate, onAddKey, onRemoveKey, depth = 0 }) => {
  if (depth > 10) return <div style={{ color: 'red' }}>Maximum nesting depth reached</div>;

  const valueTypes = ['string', 'number', 'boolean', 'object', 'array'];

  const [newKeyType, setNewKeyType] = useState('string');

  return (
    <div style={{ paddingLeft: `${depth * 20}px`, marginBottom: '10px' }}>
      {Object.entries(object).map(([key, value]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          {depth > 0 && <ChevronRight size={16} color="gray" />}

          <input
            placeholder="Key"
            value={key}
            readOnly={depth !== 0}
            style={{ flex: 1, marginRight: '8px' }}
          />

          {typeof value !== 'object' || value === null ? (
            <input
              placeholder="Value"
              value={value || ''}
              onChange={(e) => onUpdate(key, e.target.value)}
              style={{ flex: 1, marginRight: '8px' }}
            />
          ) : (
            <NestedObjectEditor
              object={value}
              onUpdate={(subKey, subValue) => {
                const updatedValue = { ...value, [subKey]: subValue };
                onUpdate(key, updatedValue);
              }}
              onAddKey={(newKey) => {
                const updatedValue = { ...value, [newKey]: '' };
                onUpdate(key, updatedValue);
              }}
              onRemoveKey={(removeKey) => {
                const updatedValue = { ...value };
                delete updatedValue[removeKey];
                onUpdate(key, updatedValue);
              }}
              depth={depth + 1}
            />
          )}

          {depth === 0 && (
            <button onClick={() => onRemoveKey(key)}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
        <input placeholder="New Key" id="newKeyName" style={{ flex: 1, marginRight: '8px' }} />

        <select value={newKeyType} onChange={(e) => setNewKeyType(e.target.value)}>
          {valueTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <button
          onClick={() => {
            const newKeyInput = document.getElementById('newKeyName');
            const newKey = newKeyInput.value.trim();

            if (!newKey) {
              alert('Please enter a key name');
              return;
            }

            let initialValue = '';
            switch (newKeyType) {
              case 'number':
                initialValue = 0;
                break;
              case 'boolean':
                initialValue = false;
                break;
              case 'object':
                initialValue = {};
                break;
              case 'array':
                initialValue = [];
                break;
              default:
                initialValue = '';
            }

            onAddKey(newKey, initialValue);
            newKeyInput.value = '';
          }}
        >
          <Plus size={16} /> Add Key
        </button>
      </div>
    </div>
  );
};

const DetailsSection2 = () => {
  const [formData, setFormData] = useState({
    name: 'MP MLA Cases',
    date_of_notification: new Date().toISOString().split('T')[0],
    details: {
      cases: [{
        case_number: '',
        court_name: '',
        state_versus: '',
        nested_details: {},
      }],
    },
  });

  const updateCaseDetails = (caseIndex, updatedDetails) => {
    setFormData((prev) => {
      const newCases = [...prev.details.cases];
      newCases[caseIndex].nested_details = updatedDetails;
      return { ...prev, details: { ...prev.details, cases: newCases } };
    });
  };

  const addCase = () => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        cases: [
          ...prev.details.cases,
          { case_number: '', court_name: '', state_versus: '', nested_details: {} },
        ],
      },
    }));
  };

  const removeCase = (index) => {
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, cases: prev.details.cases.filter((_, i) => i !== index) },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Form Data:', JSON.stringify(formData, null, 2));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {formData.details.cases.map((caseItem, caseIndex) => (
          <div key={caseIndex} style={{ marginBottom: '20px' }}>
            <input
              placeholder="Case Number"
              value={caseItem.case_number}
              onChange={(e) => {
                const newCases = [...formData.details.cases];
                newCases[caseIndex].case_number = e.target.value;
                setFormData({ ...formData, details: { ...formData.details, cases: newCases } });
              }}
            />

            <NestedObjectEditor
              object={caseItem.nested_details}
              onUpdate={(key, value) => {
                const updatedDetails = { ...caseItem.nested_details, [key]: value };
                updateCaseDetails(caseIndex, updatedDetails);
              }}
              onAddKey={(newKey, initialValue) => {
                const updatedDetails = { ...caseItem.nested_details, [newKey]: initialValue };
                updateCaseDetails(caseIndex, updatedDetails);
              }}
              onRemoveKey={(removeKey) => {
                const updatedDetails = { ...caseItem.nested_details };
                delete updatedDetails[removeKey];
                updateCaseDetails(caseIndex, updatedDetails);
              }}
            />

            <button type="button" onClick={() => removeCase(caseIndex)}>Remove Case</button>
          </div>
        ))}

        <button type="button" onClick={addCase}>Add Case</button>
        <button type="submit">Submit Form</button>
      </form>
    </div>
  );
};

export default DetailsSection2;
