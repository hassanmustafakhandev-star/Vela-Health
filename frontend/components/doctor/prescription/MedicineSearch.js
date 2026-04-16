'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Pill } from 'lucide-react';

// Common medicine database for offline suggestions
const MEDICINE_DB = [
  { name: 'Paracetamol 500mg', category: 'Analgesic' },
  { name: 'Paracetamol 1000mg', category: 'Analgesic' },
  { name: 'Amoxicillin 250mg', category: 'Antibiotic' },
  { name: 'Amoxicillin 500mg', category: 'Antibiotic' },
  { name: 'Ibuprofen 200mg', category: 'NSAID' },
  { name: 'Ibuprofen 400mg', category: 'NSAID' },
  { name: 'Omeprazole 20mg', category: 'PPI' },
  { name: 'Omeprazole 40mg', category: 'PPI' },
  { name: 'Metformin 500mg', category: 'Antidiabetic' },
  { name: 'Metformin 1000mg', category: 'Antidiabetic' },
  { name: 'Atorvastatin 10mg', category: 'Statin' },
  { name: 'Atorvastatin 20mg', category: 'Statin' },
  { name: 'Amlodipine 5mg', category: 'CCB' },
  { name: 'Amlodipine 10mg', category: 'CCB' },
  { name: 'Ciprofloxacin 500mg', category: 'Antibiotic' },
  { name: 'Metronidazole 400mg', category: 'Antiprotozoal' },
  { name: 'Pantoprazole 40mg', category: 'PPI' },
  { name: 'Azithromycin 250mg', category: 'Antibiotic' },
  { name: 'Azithromycin 500mg', category: 'Antibiotic' },
  { name: 'Cetirizine 10mg', category: 'Antihistamine' },
  { name: 'Loratadine 10mg', category: 'Antihistamine' },
  { name: 'Dexamethasone 4mg', category: 'Corticosteroid' },
  { name: 'Prednisolone 5mg', category: 'Corticosteroid' },
  { name: 'Salbutamol 100mcg', category: 'Bronchodilator' },
  { name: 'Aspirin 75mg', category: 'Antiplatelet' },
  { name: 'Aspirin 325mg', category: 'Antiplatelet' },
  { name: 'Clopidogrel 75mg', category: 'Antiplatelet' },
  { name: 'Lisinopril 5mg', category: 'ACE Inhibitor' },
  { name: 'Lisinopril 10mg', category: 'ACE Inhibitor' },
  { name: 'Losartan 50mg', category: 'ARB' },
  { name: 'Furosemide 40mg', category: 'Diuretic' },
  { name: 'Spironolactone 25mg', category: 'Diuretic' },
  { name: 'Diclofenac 50mg', category: 'NSAID' },
  { name: 'Tramadol 50mg', category: 'Opioid Analgesic' },
  { name: 'Gabapentin 300mg', category: 'Anticonvulsant' },
  { name: 'Vitamin D3 1000IU', category: 'Supplement' },
  { name: 'Vitamin B12 500mcg', category: 'Supplement' },
  { name: 'Folic Acid 5mg', category: 'Supplement' },
  { name: 'Ferrous Sulfate 200mg', category: 'Iron Supplement' },
  { name: 'Cefuroxime 500mg', category: 'Antibiotic' },
];

/**
 * MedicineSearch
 * Autocomplete input for finding medicines with local suggestion fallback.
 * Props:
 *  - value: string (current input value)
 *  - onChange: fn(name: string) — called when a medicine is selected or typed
 */
export default function MedicineSearch({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange?.(val);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const filtered = MEDICINE_DB.filter((m) =>
      m.name.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 8);

    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  };

  const handleSelect = (medicine) => {
    setQuery(medicine.name);
    onChange?.(medicine.name);
    setSuggestions([]);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
        <input
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="Search medicine..."
          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-prism-fuchsia/50 transition-all"
        />
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-prism-surface border border-white/10 rounded-xl shadow-2xl backdrop-blur-2xl overflow-hidden">
          {suggestions.map((med, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(med)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-prism-fuchsia/10 transition-colors text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-prism-fuchsia/10 border border-prism-fuchsia/20 flex items-center justify-center text-prism-fuchsia flex-shrink-0 group-hover:bg-prism-fuchsia/20">
                <Pill size={12} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{med.name}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">{med.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}