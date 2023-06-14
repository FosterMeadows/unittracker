import React, { useState, useEffect } from 'react';
import './StudentPaceIndicator.css';
import catchingUpImg from '../assets/catchingUpImg.png';
import onPaceImg from '../assets/onPaceImg.png';
import forgingAheadImg from '../assets/forgingAheadImg.png';

const StudentPaceIndicator = ({ column, saveColumn }) => {
  const [studentPace, setStudentPace] = useState(column.studentPace || 'normal');

  useEffect(() => {
    setStudentPace(column.studentPace || 'normal');
  }, [column.studentPace]);

  const handlePaceClick = async (pace) => {
    if (studentPace === pace) {
      setStudentPace('normal');
      column.studentPace = 'normal';
    } else {
      setStudentPace(pace);
      column.studentPace = pace;
    }
    await saveColumn(column);
  };

  const paceBackground = {
    catchingUp: '#E74646',
    onPace: '#d4edda',
    forgingAhead: '#cce5ff',
    normal: '#FFE5CA',
  };

  return (
    <div className={`student-pace`} style={{ backgroundColor: paceBackground[studentPace] }}>
<div className={`student-pace-options ${studentPace === 'normal' ? 'visible' : 'hidden'}`}>
  <img
    src={catchingUpImg}
    alt="Catching Up"
    className={`student-pace-image ${studentPace === 'catchingUp' ? 'selected' : ''}`}
    onClick={() => handlePaceClick('catchingUp')}
  />
  <img
    src={onPaceImg}
    alt="On Pace"
    className={`student-pace-image ${studentPace === 'onPace' ? 'selected' : ''}`}
    onClick={() => handlePaceClick('onPace')}
  />
  <img
    src={forgingAheadImg}
    alt="Forging Ahead"
    className={`student-pace-image ${studentPace === 'forgingAhead' ? 'selected' : ''}`}
    onClick={() => handlePaceClick('forgingAhead')}
  />
</div>

      {studentPace !== 'normal' && (
        <div className="student-pace-active">
          <img src={studentPace === 'catchingUp' ? catchingUpImg : studentPace === 'onPace' ? onPaceImg : forgingAheadImg} alt={studentPace} className="student-pace-image" data-pace={studentPace} onClick={() => handlePaceClick('normal')} />
        </div>
      )}
    </div>
  );
};

export default StudentPaceIndicator;
