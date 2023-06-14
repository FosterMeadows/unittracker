import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableStudent = ({ student, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li
      className={`student-item${isDragging ? ' dragging' : ''}`} // Update this line
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {student}
    </li>
  );
};
