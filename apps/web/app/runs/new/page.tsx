'use client';
import { useState } from 'react';
import axios from 'axios';


export default function NewRun() {
const [sisCourseId, setSIS] = useState('');
const [prompt, setPrompt] = useState('Standardize headings; add alt text placeholders; upgrade to DP accordions.');
const [budget, setBudget] = useState(5);


const submit = async () => {
await axios.post(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/runs', {
sisCourseId,
prompt,
dpMode: true,
portability: true,
budgetCapUsd: budget,
});
alert('Run created');
};


return (
<main className="p-6 space-y-4">
<h1 className="text-xl font-semibold">New Run</h1>
<input className="border p-2 w-full" placeholder="SIS Course ID" value={sisCourseId} onChange={e=>setSIS(e.target.value)} />
<textarea className="border p-2 w-full" rows={6} value={prompt} onChange={e=>setPrompt(e.target.value)} />
<label className="block">Budget Cap (USD)
<input type="number" className="border p-2 ml-2" value={budget} onChange={e=>setBudget(Number(e.target.value))} />
</label>
<button className="px-4 py-2 bg-black text-white" onClick={submit}>Create Run</button>
</main>
);
}
