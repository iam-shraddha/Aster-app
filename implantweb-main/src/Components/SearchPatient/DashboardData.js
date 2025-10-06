import React, { useEffect, useState } from 'react';
import { addImplantPrintHistory, getImplantPrintHistoryByHospital } from '../../services/dasboardAPI';

const ImplantPrintHistory = ({ registrationNumber, hospitalId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch implant print history by hospital
    const fetchHistory = async () => {
      try {
        const data = await getImplantPrintHistoryByHospital(hospitalId);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    if (hospitalId) fetchHistory();
  }, [hospitalId]);

  const addHistory = async () => {
    if (!registrationNumber) {
      console.error('Registration number is missing!');
      return;
    }

    const newEntry = {
      hospitalId,
      patientId: registrationNumber,
      printDate: new Date().toISOString(),
    };

    try {
      await addImplantPrintHistory(newEntry);
      // Refresh the history after adding a new entry
      const updatedHistory = await getImplantPrintHistoryByHospital(hospitalId);
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error adding history:', error);
    }
  };

  return (
    <div>
      <h2>Implant Print History</h2>
      <button onClick={addHistory}>Add History</button>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            Patient ID: {item.patientId}, Print Date: {new Date(item.printDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImplantPrintHistory;
