import React, { useState, useEffect } from 'react';
import { SortableStudent } from './SortableStudent';
import { useDroppable } from '@dnd-kit/core';
import StudentPaceIndicator from './StudentPaceIndicator';
import Modal from 'react-modal';
import '../styles/Modal.css';

export const SortableColumn = ({ column, saveColumn }) => {
  const [editing, setEditing] = useState(false);
  const [priority, setPriority] = useState('Choose Priority');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unitName, setUnitName] = useState(column.title);
  const [unitDescription, setUnitDescription] = useState(column.description || "");

    // Add a useEffect call here
    useEffect(() => {
      setUnitName(column.title);
      setUnitDescription(column.description || "");
    }, [column]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSave = async () => {
    column.title = unitName;
    column.description = unitDescription;
    await saveColumn(column); 
    closeModal();
  };  

  const handleHeaderClick = () => {
    openModal();
  };
  
  const handleHeaderBlur = async (event) => {
    setEditing(false);
    column.title = event.target.value;
    await saveColumn(column); // Save the updated column title to the database
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const headerContent = (
    <>
      <span onClick={handleHeaderClick}>{column.title}</span>
      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Unit Modal"
  className="modal"
>
  <h2>Edit Unit</h2>
  <div className="unit-info">
    <div>
      <label>
        Name or rename the task here:
        <input type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
      </label>
    </div>
    <div>
      <label>
        Describe what the task students need to complete is:
        <textarea value={unitDescription} onChange={(e) => setUnitDescription(e.target.value)} />
      </label>
    </div>
  </div>
  <div className="modal-buttons">
    <button onClick={handleSave}>Save</button>
    <button onClick={closeModal}>Cancel</button>
  </div>
</Modal>

    </>
  );
  

  const { isOver, setNodeRef } = useDroppable({
    id: `${column.id}-droppable`,
  });

  const droppableStyles = {
   // backgroundColor: isOver ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 0, 255, 0.2)',
    minHeight: column.students.length === 0 ? '50px' : '0',
  };

  return (
    <div className="column">
      <div className="column-header">{headerContent}</div>
      <div className="column-indicators">
        <StudentPaceIndicator column={column} saveColumn={saveColumn} />
      </div>

      <ul className="student-list" ref={setNodeRef} style={droppableStyles}>
        {column.students.map((student) => (
          <SortableStudent key={`${column.id}-${student}`} student={student} id={`${column.id}-${student}`} />
        ))}
      </ul>
    </div>
  );
};
