import React, { useState } from 'react';

const StudentForm = ({ columns, addStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const selectedColumn = columns.find((column) => `column-${column.id}` === selectedColumnId);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName && selectedColumn) {
      addStudent(selectedColumn, studentName);
      setStudentName('');
      setShowModal(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <button className = "button-30" onClick={openModal}>Add Student</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
          <form onSubmit={handleSubmit}>
  <input
    className="form-name-submission"
    type="text"
    value={studentName}
    onChange={(e) => setStudentName(e.target.value)}
    placeholder="Student Name"
  />
  <select
    value={selectedColumnId}
    onChange={(e) => setSelectedColumnId(e.target.value)}
  >
    <option value="">Select column</option>
    {columns.map((column) => (
      <option key={column.id} value={`column-${column.id}`}>
        {column.title}
      </option>
    ))}
  </select>
  <button className="button-30" type="submit">
    Submit
  </button>
  <button className="button-30" onClick={() => setShowModal(false)}>
    Close
  </button>
</form>

          </div>
        </div>
      )}
    </>
  );
};

export default StudentForm;
