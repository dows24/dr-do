/**
 * Patient Database
 * Fetches patient data from Firebase Firestore
 */

import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Find a patient by ID, name, and date of birth
 * @param {string} id - Patient ID
 * @param {string} name - Patient name
 * @param {string} dob - Date of birth (YYYY-MM-DD)
 * @returns {Promise<Object|null>} Patient object or null if not found
 */
export async function findPatient(id, name, dob) {
    try {
        const patientsRef = collection(db, 'patients');
        const q = query(
            patientsRef,
            where('patientId', '==', id),
            where('name', '==', name),
            where('birthDate', '==', dob)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // Return the first matching patient
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        // Transform Firestore data to match expected format
        return {
            id: data.patientId,
            name: data.name,
            dob: data.birthDate,
            surgeryDate: data.surgeryDate,
            surgeryType: data.surgeryType || 'Unknown'
        };
    } catch (error) {
        console.error('Error finding patient:', error);
        return null;
    }
}
