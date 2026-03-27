import { usePrescriptionStore } from '@/store/doctor/prescriptionStore';

export function usePrescriptionBuilder() {
  const store = usePrescriptionStore();

  const addMedicineItem = (medicine) => {
    store.addMedicine(medicine);
  };

  const updateMedicineItem = (id, updates) => {
    store.updateMedicine(id, updates);
  };

  const removeMedicineItem = (id) => {
    store.removeMedicine(id);
  };

  const finalizePrescription = async () => {
    await store.sendPrescription();
  };

  return {
    ...store,
    addMedicineItem,
    updateMedicineItem,
    removeMedicineItem,
    finalizePrescription
  };
}