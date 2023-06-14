import '../styles/AppLayout.css';
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, verticalListSortingStrategy, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableColumn } from './SortableColumn';
import { SortableStudent } from './SortableStudent';
import { db } from './firebaseConfig';
import { collection, onSnapshot, doc, setDoc, addDoc, getDoc, deleteDoc, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import StudentForm from './StudentForm';
import { getAuth, signOut } from 'firebase/auth';


const AppLayout = ({ initialSelectedClass, onSwitchToLandingPage }) => {
    
    const [columns, setColumns] = useState([
        {
          id: '1',
          title: 'Task 1',
          students: ['Alice', 'Bob', 'Steven', 'Poppy', 'Eugene'],
          studentPace: 'onPace', // 'onPace' or 'behind'
          priorityObjective: true, // true or false
        },
      ]);

      const [selectedClassName, setSelectedClassName] = useState(null);
      const [classNames, setClassNames] = useState([]);

      const auth = getAuth();
      const userId = auth.currentUser.uid; // Get the current user's UID

      async function createInitialDataStructure(user) {
        const userDocRef = doc(db, "users", user.uid);
      
        // Create a class document for the new user
        const classDocRef = doc(collection(userDocRef, "classes"));
        //await setDoc(classDocRef, { name: "Class 1" });
      
        // Create a 'columns' collection within the class document
        const columnsCollectionRef = collection(classDocRef, "columns");
      
        // Add initial column documents to the 'columns' collection
        // Add initial column documents to the 'columns' collection
        const column1Ref = doc(columnsCollectionRef);
        await setDoc(column1Ref, { title: "Column 1", index: 0, description: "Initial description" });

      
        // Add more columns as needed
      }

      async function checkAndCreateInitialDataStructure(user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
    
        if (!userSnapshot.exists()) {
          await createInitialDataStructure(user);
        }
      }

      const addStudent = async (column, studentName) => {
        const columnToUpdate = columns.find((col) => col.id === column.id);
        if (columnToUpdate) {
          columnToUpdate.students.push(studentName);
      
          // Save the changes
          await saveColumn(columnToUpdate);
      
          // Update the local state
          const newColumns = columns.map((col) =>
            col.id === column.id ? columnToUpdate : col
          );
          setColumns(newColumns);
        }
      };
      
      
// Load columns from Firestore

useEffect(() => {
  if (selectedClassName) {
      const classDocRef = doc(db, "users", userId, "classes", selectedClassName);
      const columnsCollectionRef = collection(classDocRef, "columns");
      const unsubscribe = onSnapshot(columnsCollectionRef, (snapshot) => {
          const loadedColumns = snapshot.docs.map((doc) => ({
              id: doc.id,
              // If 'description' is not present in the Firestore document, set a default value.
              description: doc.data().description || 'Default description',
              ...doc.data(),
          }));
          setColumns(loadedColumns);
      });

      return () => unsubscribe();
  }
}, [selectedClassName, userId]);

  
  useEffect(() => {
    const fetchClassNames = async () => {
      const classRef = collection(db, "users", userId, "classes");
      const snapshot = await getDocs(classRef);
  
      if (!snapshot.empty) {
        const fetchedClassNames = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClassNames(fetchedClassNames);
  
        // Set the first class as the selected class if no class is selected
        if (!selectedClassName) {
          setSelectedClassName(fetchedClassNames[0].id);
        }
      }
    };
  
    fetchClassNames();
  }, [userId, selectedClassName]);
  

  useEffect(() => {
    if (initialSelectedClass) {
      handleClassChange(initialSelectedClass.id);
    }
  }, [initialSelectedClass]);
  
  
  const signOutUser = async () => {
    const auth = getAuth();
    await signOut(auth);
  };
  

  const saveColumn = async (column) => {
    // If 'description' is not present in the column object, set a default value.
    column.description = column.description || 'Default description';

    if (column.id) {
        await setDoc(doc(db, "users", userId, "classes", selectedClassName, "columns", column.id), column);
    } else {
        await addDoc(collection(db, "users", userId, "classes", selectedClassName, "columns"), column);
    }
};

  
  
  const deleteColumn = async (columnId) => {
    await deleteDoc(doc(db, "users", userId, "classes", selectedClassName, "columns", columnId));
  };
  
  
  const [columnCounter, setColumnCounter] = useState(0);

    useEffect(() => 
    {
        setColumnCounter(columns.length + 1);
    }, [columns]);


    const addColumn = async () => {
        const newId = (columns.length + 1).toString();
        const initialStudents = columns.length === 0 ? ['Alice', 'Bob', 'Steven', 'Poppy', 'Eugene'] : [];
      
        setColumns([...columns, { id: newId, title: `Task ${newId}`, students: initialStudents }]);
        setColumnCounter(columns.length + 2);
      
        // Save the new column
        await saveColumn({ id: newId, title: `Task ${newId}`, students: initialStudents, description: "New column description" });
      };
      
      
  const removeColumn = async () => {
    if (columns.length > 1) {
      setColumns(columns.slice(0, -1));

      // Delete the last column
      await deleteColumn(columns[columns.length - 1].id);
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  

  const handleDragStart = (event) => {
    setActiveStudent(event.active.id);
  };

  const [activeStudent, setActiveStudent] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
  
    setActiveStudent(null);
  
    if (active && over) {
      const activeColumnId = active.id.split("-")[0];
      const overColumnId = over.id.split("-")[0];
  
      if (activeColumnId !== overColumnId) {
        const activeColumnIndex = columns.findIndex(
          (column) => column.id === activeColumnId
        );
        const overColumnIndex = columns.findIndex(
          (column) => column.id === overColumnId
        );
  
        if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
          const activeStudentIndex = columns[activeColumnIndex].students.findIndex(
            (student) => `${activeColumnId}-${student}` === active.id
          );
          const newColumns = [...columns];
  
          // Move the activeStudent from the source column to the destination column
          const [removedStudent] = newColumns[activeColumnIndex].students.splice(activeStudentIndex, 1);
          newColumns[overColumnIndex].students.push(removedStudent);
  
          // Batch update the columns in Firestore
          const batch = writeBatch(db);
          const activeColumnRef = doc(db, "users", userId, "classes", selectedClassName, "columns", activeColumnId);
          const overColumnRef = doc(db, "users", userId, "classes", selectedClassName, "columns", overColumnId);
          batch.update(activeColumnRef, { students: newColumns[activeColumnIndex].students });
          batch.update(overColumnRef, { students: newColumns[overColumnIndex].students });
          await batch.commit();
  
          // Update the local state
          setColumns(newColumns);
        }
      }
    }
  };
  
  const columnIds = columns.map((column) => column.id);

  const handleClassChange = async (classId) => {
        if (!classId) return;
      
        
    setSelectedClassName(classId);
  
    const initializeNewClass = async () => {
      const initialColumns = [
        // ...
      ];
  
      const batch = writeBatch(db);
  
      for (const column of initialColumns) {
        const columnRef = doc(db, "users", userId, "classes", classId, "columns", column.id);
        batch.set(columnRef, column);
      }
  
      await batch.commit();
  
      return initialColumns;
    };
  
    const loadClassData = async () => {
      const classRef = collection(db, "users", userId, "classes", classId, "columns");
      const snapshot = await getDocs(classRef);
    
      // Update the state with the loaded columns
      const loadedColumns = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return loadedColumns;
    };
    
  
    // Check if the class exists in Firestore
    const classDocRef = doc(db, "users", userId, "classes", classId);
    const classSnapshot = await getDoc(classDocRef);
  
    let newColumns = [];
    if (!classSnapshot.exists()) {
      // Initialize the new class data
      newColumns = await initializeNewClass();
    } else {
      // Load the existing class data
      newColumns = await loadClassData();
    }
  
    // Update the state with the new columns
    setColumns(newColumns);
    setColumnCounter(newColumns.length + 1); // Update the columnCounter
  };
  
  
  
  
  
  

  return (
    <div className="app-layout">
    
    <div className="command-center">
      
      <div className="column-controls">
        <button className = "button-30" onClick={addColumn}>Add Column</button>
        <button className = "button-30" onClick={removeColumn}>Remove Column</button>
      </div>

      <div className="student-form-container">
        <StudentForm columns={columns} addStudent={addStudent} />
      </div>

      <div className="class-change-controls">
      <label htmlFor="class-selector" style={{ marginRight: '10px' }}>
        Select Class:
      </label>
      <select
        className="dropdown-30"
        id="class-selector"
        value={selectedClassName}
        onChange={(e) => handleClassChange(e.target.value)}
      >
        {classNames.map((classItem) => (
          <option key={classItem.id} value={classItem.id}>
            {classItem.name}
          </option>
        ))}
      </select>
    </div>
    </div>
        

        <main className="main-content">

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >

        <SortableContext items={columnIds} strategy={rectSortingStrategy}>        
        
        <div className="columns-container">
        
            {columns.map((column, index) => (
              <SortableColumn
              key={column.id}
              column={column}
              index={index}
              students={column.students}
              saveColumn={saveColumn}
              deleteColumn={deleteColumn}
              
            />
            
            ))}
          </div>

        </SortableContext>

        <DragOverlay>
            {activeStudent ? <SortableStudent id={activeStudent} student={activeStudent.split('-')[1]} /> : null}
        </DragOverlay>

      </DndContext>
      </main>
      
      <footer className="footer">  <button onClick={signOutUser}>Sign Out</button>
      <button onClick={onSwitchToLandingPage}>Switch to Landing Page</button>

  Footer content</footer>

    </div>
  );
};

export default AppLayout;