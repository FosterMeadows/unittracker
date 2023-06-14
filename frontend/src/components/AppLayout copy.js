import '../styles/AppLayout.css';
import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, verticalListSortingStrategy, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableColumn } from './SortableColumn';
import { SortableStudent } from './SortableStudent';
import { db } from './firebaseConfig';

const AppLayout = () => {
    const [columns, setColumns] = useState([
        {
          id: '1',
          title: 'Unit 1',
          students: ['Alice', 'Bob', 'Steven', 'Poppy', 'Eugene'],
          studentPace: 'onPace', // 'onPace' or 'behind'
          priorityObjective: true, // true or false
        },
      ]);
      

  const [columnCounter, setColumnCounter] = useState(2);

  const addColumn = () => {
    const newId = columnCounter.toString();
    setColumns([...columns, { id: newId, title: `Unit ${newId}`, students: [] }]);
    setColumnCounter(columnCounter + 1);
  };

  const removeColumn = () => {
    if (columns.length > 1) {
      setColumns(columns.slice(0, -1));
    }
  };

  

  const [activeStudent, setActiveStudent] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    setActiveStudent(null);
  
    if (active && over) {
      const activeColumnId = active.id.split('-')[0];
      const overColumnId = over.id.split('-')[0];
  
      const activeColumnIndex = columns.findIndex((column) => column.id === activeColumnId);
      const overColumnIndex = columns.findIndex((column) => column.id === overColumnId);
  
      if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
        const activeStudent = columns[activeColumnIndex].students.find((student) => `${activeColumnId}-${student}` === active.id);
        const newColumns = [...columns];
  
        newColumns[activeColumnIndex].students = newColumns[activeColumnIndex].students.filter((student) => `${activeColumnId}-${student}` !== active.id);
  
        if (activeColumnId === overColumnId) {
          // Sort within the same column
          const overStudentIndex = newColumns[overColumnIndex].students.findIndex((student) => `${overColumnId}-${student}` === over.id);
          newColumns[overColumnIndex].students.splice(overStudentIndex, 0, activeStudent);
        } else {
          // Move to a different column
          const overStudentIndex = newColumns[overColumnIndex].students.findIndex((student) => `${overColumnId}-${student}` === over.id);
          newColumns[overColumnIndex].students.splice(overStudentIndex, 0, activeStudent);
        }
  
        setColumns(newColumns);
      }
    }
  };
  
  

  const handleDragStart = (event) => {
    setActiveStudent(event.active.id);
  };

  const [selectedClass, setSelectedClass] = useState('Class 1');

  const handleClassChange = (event) => {
      setSelectedClass(event.target.value);
      // Update your application state or perform any required actions based on the selected class.
  };

  return (
    <div className="app-layout">
      <header className="header">
        Header content <br></br>
        
        <button onClick={addColumn}>Add Column</button>
        <button onClick={removeColumn}>Remove Column</button>

<br></br>
        <label htmlFor="class-selector">Select Class: </label>
                <select id="class-selector" value={selectedClass} onChange={handleClassChange}>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                </select>
      </header>
      <main className="main-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragEnd}
          onDragStart={handleDragStart}
        >
        <SortableContext
  items={columns.flatMap(({ id, students }) =>
    students.map((student) => `${id}-${student}`)
  )}
  strategy={rectSortingStrategy}
>


                        <div className="columns-container">
              {columns.map((column) => (
                <SortableColumn key={column.id} column={column} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeStudent ? (
              <SortableStudent
                student={activeStudent.split('-')[1]}
                id={activeStudent}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
      <footer className="footer">Footer content</footer>
    </div>
  );
};

export default AppLayout;

